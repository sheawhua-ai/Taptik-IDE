import React, { useState } from 'react';
import { 
  Workflow, ShieldCheck, Activity, ArrowRight, Brain, 
  Search, Layers, Share2, CheckCircle2, Clock, Zap, Play, Pause, X,
  LayoutGrid, List, AlertCircle, RefreshCcw, Eye, Check, MinusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ExecutionCenter: React.FC = () => {
  const [activePlan, setActivePlan] = useState<number | null>(0);
  const [isCompactView, setIsCompactView] = useState(false);
  const [isApprovalDrawerOpen, setIsApprovalDrawerOpen] = useState(false);

  const PLANS = [
    { 
        id: 0,
        title: '夏季大促爆文流水线', 
        status: '85%', 
        agent: '生产助手', 
        color: 'text-primary-500',
        errorState: null,
        hitlState: 'awaiting', // Human-in-the-loop
        nodes: [
            { step: '01', title: '意图识别', desc: '新商家首篇爆文生产', icon: Search, status: 'completed' },
            { step: '02', title: '任务编排', desc: 'AI 正基于选题逻辑重组', icon: Workflow, status: 'completed' },
            { step: '03', title: '人机校验', desc: '待生成的文案质量风控', icon: ShieldCheck, status: 'hitl' },
            { step: '04', title: '自动化分发', desc: '小红书 API 写入就绪', icon: Share2, status: 'pending' },
        ]
    },
    { 
        id: 1,
        title: '竞品巡航与蓝海词探测', 
        status: '40%', 
        agent: '巡航助手', 
        color: 'text-orange-500',
        errorState: 'API_RATE_LIMIT',
        hitlState: null,
        nodes: [
            { step: '01', title: '全网扫描', desc: '全赛道关键词抓取', icon: Search, status: 'completed' },
            { step: '02', title: '词云过滤', desc: '剔除高竞争大词', icon: Workflow, status: 'error' },
            { step: '03', title: '趋势预判', desc: '热度回归模型计算', icon: Brain, status: 'pending' },
            { step: '04', title: '报告输出', desc: '输出巡航策略', icon: CheckCircle2, status: 'pending' },
        ]
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center">
              <Workflow size={24} />
           </div>
           <div>
              <h2 className="text-[17px] font-black text-neutral-900 tracking-tight">编排层：智策分发中心 (Orchestration)</h2>
              <p className="text-[11px] font-bold text-neutral-400">流水线助手: 负责 Agent 集群的任务排期、容错与闭环优化</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-neutral-100 p-1 rounded-xl shrink-0">
            <button 
              onClick={() => setIsCompactView(false)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-[11px] font-black transition-all ${!isCompactView ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              <LayoutGrid size={14} /> 卡片视图
            </button>
            <button 
              onClick={() => setIsCompactView(true)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-[11px] font-black transition-all ${isCompactView ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              <List size={14} /> 紧凑列表
            </button>
          </div>
          <button className="w-10 h-10 bg-neutral-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-primary-500 transition-all active:scale-95">
             <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden bg-neutral-50/20">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Active Orchestration Plans */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
                        <Play size={24} className="text-primary-500" />
                        正在运行的任务流水线
                    </h3>
                </div>

                {!isCompactView ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {PLANS.map((plan, i) => (
                            <div key={i} onClick={() => setActivePlan(i)} className={`p-8 bg-white rounded-[40px] border transition-all cursor-pointer group relative overflow-hidden ${activePlan === i ? 'border-primary-500 shadow-2xl scale-[1.02]' : 'border-neutral-100 hover:border-neutral-200 shadow-sm'} ${plan.errorState ? 'border-red-200 bg-red-50/10' : ''} ${plan.hitlState ? 'border-orange-200 bg-orange-50/10' : ''}`}>
                                {plan.errorState && (
                                    <div className="absolute top-0 right-0 px-6 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl z-10 flex items-center gap-2 shadow-lg">
                                        <AlertCircle size={14} /> {plan.errorState}
                                    </div>
                                )}
                                {plan.hitlState && (
                                    <div className="absolute top-0 right-0 px-6 py-2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl z-10 flex items-center gap-2 shadow-lg animate-pulse">
                                        <Pause size={14} /> Paused: HITL
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-black text-neutral-900">{plan.title}</h4>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${plan.errorState ? 'bg-red-500' : plan.hitlState ? 'bg-orange-500' : (plan.id === 0 ? 'bg-primary-500' : 'bg-orange-500')} animate-pulse`} />
                                            <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">
                                                {plan.agent} | {plan.errorState ? '已拦截' : plan.hitlState ? '等待校验' : `${plan.status} 处理中`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {plan.errorState && (
                                            <button className="px-3 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-red-600 transition-all">
                                                <RefreshCcw size={12} /> 一键重试
                                            </button>
                                        )}
                                        <button className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors shrink-0">
                                            <Pause size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden p-0.5">
                                        <div className={`h-full ${plan.errorState ? 'bg-red-500' : plan.hitlState ? 'bg-orange-500' : (plan.id === 0 ? 'bg-primary-500' : 'bg-orange-500')} rounded-full transition-all duration-500`} style={{ width: plan.status }} />
                                    </div>
                                    <span className="text-[12px] font-black text-neutral-900">{plan.status}</span>
                                </div>

                                <div className="grid grid-cols-4 gap-2">
                                    {plan.nodes.map((node, j) => (
                                        <div key={j} className={`h-1.5 rounded-full ${node.status === 'completed' ? 'bg-emerald-500' : node.status === 'error' ? 'bg-red-500' : node.status === 'hitl' ? 'bg-orange-500 animate-pulse' : (node.status === 'active' ? (plan.id === 0 ? 'bg-primary-500' : 'bg-orange-500') : 'bg-neutral-100')}`} />
                                    ))}
                                </div>
                                
                                {plan.errorState && (
                                    <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between">
                                        <p className="text-[11px] font-bold text-red-600">由于频繁调用，小红书 API 触发了 429 限流保护，建议暂停 15 分钟后重试。</p>
                                        <button className="p-2 text-red-700 hover:bg-red-100 rounded-lg transition-colors">
                                            <Eye size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-neutral-100 rounded-[32px] shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50/50 border-b border-neutral-100">
                                    <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest">任务名称</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest">主责 Agent</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest">当前进度</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest">监控状态</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-neutral-400 uppercase tracking-widest">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {PLANS.map((plan, i) => (
                                    <tr key={i} onClick={() => setActivePlan(i)} className={`group cursor-pointer hover:bg-neutral-50/50 transition-colors ${activePlan === i ? 'bg-primary-50/30' : ''}`}>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${plan.errorState ? 'bg-red-500' : plan.hitlState ? 'bg-orange-500' : 'bg-primary-500'}`} />
                                                <span className="text-[14px] font-black text-neutral-900">{plan.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-neutral-100 rounded-lg text-[11px] font-black text-neutral-500">{plan.agent}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${plan.errorState ? 'bg-red-500' : plan.hitlState ? 'bg-orange-500' : 'bg-primary-500'}`} style={{ width: plan.status }} />
                                                </div>
                                                <span className="text-[12px] font-black text-neutral-900">{plan.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {plan.errorState ? (
                                                <span className="text-red-500 text-[11px] font-black flex items-center gap-1"><AlertCircle size={12}/> {plan.errorState}</span>
                                            ) : plan.hitlState ? (
                                                <span className="text-orange-500 text-[11px] font-black flex items-center gap-1 animate-pulse"><Pause size={12}/> HITL AWAITING</span>
                                            ) : (
                                                <span className="text-emerald-500 text-[11px] font-black flex items-center gap-1"><RefreshCcw size={12} className="animate-spin" /> NORMAL</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-900 shadow-sm transition-all"><Pause size={14}/></button>
                                                <button className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white hover:bg-primary-500 shadow-lg transition-all"><Play size={14}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detailed Visualizer for Selected Plan */}
            {activePlan !== null && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-neutral-100 rounded-[48px] p-12 shadow-sm">
                    <div className="flex items-center gap-4 mb-12">
                        <div className={`w-14 h-14 rounded-2xl ${activePlan === 0 ? 'bg-primary-50 text-primary-500' : 'bg-orange-50 text-orange-500'} flex items-center justify-center`}>
                            <Workflow size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{PLANS[activePlan].title}</h3>
                            <p className="text-[13px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">Agent 集群并行链路实时视图</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-neutral-100 -translate-y-1/2 hidden lg:block z-0" />
                        
                        {PLANS[activePlan].nodes.map((node, i) => (
                            <div 
                              key={i} 
                              onClick={() => node.status === 'hitl' && setIsApprovalDrawerOpen(true)}
                              className={`relative z-10 bg-white border p-8 rounded-[40px] transition-all duration-500 shadow-sm ${node.status === 'active' ? 'border-primary-500 ring-4 ring-primary-500/5' : node.status === 'hitl' ? 'border-orange-500 ring-8 ring-orange-500/10 cursor-pointer hover:scale-105' : 'border-neutral-100'}`}
                            >
                                {node.status === 'hitl' && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg z-20 animate-bounce">
                                        Action Required
                                    </div>
                                )}
                                
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all ${node.status === 'completed' ? 'bg-emerald-500 text-white' : node.status === 'active' ? 'bg-neutral-900 text-white animate-pulse' : node.status === 'hitl' ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/30' : 'bg-neutral-50 text-neutral-300'}`}>
                                    {node.status === 'completed' ? <CheckCircle2 size={24} /> : <node.icon size={24} />}
                                </div>
                                <h4 className={`text-[17px] font-black mb-2 ${node.status === 'pending' ? 'text-neutral-400' : 'text-neutral-900'}`}>{node.title}</h4>
                                <p className="text-[12px] text-neutral-400 font-bold leading-relaxed">{node.desc}</p>
                                
                                {node.status === 'active' && (
                                    <div className="mt-6 pt-6 border-t border-neutral-100">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-primary-500 uppercase tracking-widest animate-pulse">
                                            <Activity size={12} /> Running Instance
                                        </div>
                                    </div>
                                )}

                                {node.status === 'hitl' && (
                                    <div className="mt-6 pt-6 border-t border-orange-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest">
                                            <Pause size={12} /> Paused for Approval
                                        </div>
                                        <ArrowRight size={14} className="text-orange-500" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Quality Monitoring & Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
                        <ShieldCheck size={24} className="text-emerald-500" />
                        实时风控 & 质量实验室
                    </h3>
                    <div className="bg-neutral-900 rounded-[48px] p-10 text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                            <Activity size={180} className="text-emerald-500" />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <p className="text-[12px] font-black text-emerald-400 uppercase tracking-[0.2em]">质量决策引擎 (Closed Loop)</p>
                                    <h4 className="text-xl font-black">监测到笔记表现偏移</h4>
                                </div>
                            </div>
                            
                            <p className="text-[15px] font-bold text-neutral-300 leading-relaxed max-w-xl">
                                监测到最近 <span className="text-white font-black underline underline-offset-4 decoration-emerald-500">6 篇</span> 发布的笔记入池表现低于大盘预期。助手已通过研判模块，自动完成了以下闭环操作：
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                    <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">底层优化</div>
                                    <div className="text-[14px] font-black">#关键词权重调整</div>
                                </div>
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                    <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">调度优化</div>
                                    <div className="text-[14px] font-black">延后非核心发布任务</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
                        <Clock size={24} className="text-neutral-400" />
                        最近执行日志
                    </h3>
                    <div className="bg-white border border-neutral-100 rounded-[40px] p-8 shadow-sm space-y-6 flex-1">
                        {[
                            { time: '14:23:05', msg: '文案 A/B 测试逻辑重排完毕', type: 'success' },
                            { time: '13:50:12', msg: '调用 Skill: 爆文蒸馏器 (Paid)', type: 'info' },
                            { time: '13:12:44', msg: '蓝海词雷达扫描异常 (Retry...)', type: 'warning' },
                            { time: '12:00:00', msg: '系统全节点健康度自检通过', type: 'success' },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="text-[11px] font-black text-neutral-300 font-mono pt-1 shrink-0">{log.time}</div>
                                <div className={`text-[13px] font-bold ${log.type === 'success' ? 'text-emerald-700' : log.type === 'warning' ? 'text-orange-600' : 'text-neutral-500'}`}>
                                    {log.msg}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Drawer for HITL */}
      <AnimatePresence>
        {isApprovalDrawerOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsApprovalDrawerOpen(false)}
               className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[800px] bg-white shadow-2xl z-[101] flex flex-col p-12 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                      <ShieldCheck size={32} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-neutral-900 tracking-tight">人机校验审批中心</h3>
                      <p className="text-[13px] font-bold text-neutral-400 uppercase tracking-widest">待办事项：夏季大促爆文文案初稿确认 (Node 03)</p>
                   </div>
                </div>
                <button onClick={() => setIsApprovalDrawerOpen(false)} className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="bg-neutral-50 rounded-[48px] p-10 space-y-10 border border-neutral-100">
                <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-neutral-100 shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500">
                        <Activity size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">当前运行状态</p>
                         <p className="text-[15px] font-black text-orange-500 flex items-center gap-2">
                           <Pause size={16} fill="currentColor" /> 任务流已自动挂起，等待人工核准
                         </p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">预计延时风险</p>
                      <p className="text-[15px] font-black text-neutral-900">12m 45s</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <h4 className="text-lg font-black text-neutral-900 flex items-center gap-3">
                     <Brain size={24} className="text-primary-500" /> AI 生成初稿内容预览
                   </h4>
                   <div className="p-8 bg-white rounded-[40px] border border-neutral-100 space-y-6 shadow-inner">
                      <div className="flex items-center gap-3">
                         <span className="px-3 py-1 bg-primary-500 text-white text-[10px] font-black rounded-full uppercase">小红书风格</span>
                         <span className="px-3 py-1 bg-neutral-100 text-neutral-500 text-[10px] font-black rounded-full uppercase">夏季大促主题</span>
                      </div>
                      <h5 className="text-xl font-black leading-tight text-neutral-900">标题：救命！这款宠物粮真的让挑嘴猫从此开启“炫饭”模式！😭🐾</h5>
                      <p className="text-[15px] font-bold text-neutral-600 leading-relaxed">
                        家人们谁懂啊！最近入手的这款「宠味巡航」定制粮真的绝了！之前试了好几个大牌，主子都爱答不理，这次竟然直接光盘！... (此处省略 800 字正文)
                      </p>
                      <div className="grid grid-cols-3 gap-4 h-48">
                         <div className="bg-neutral-100 rounded-3xl border border-neutral-200 flex items-center justify-center text-neutral-400 text-[10px] font-black uppercase">封面图 A - AI 已生成</div>
                         <div className="bg-neutral-100 rounded-3xl border border-neutral-200 flex items-center justify-center text-neutral-400 text-[10px] font-black uppercase">展示图 B - AI 已生成</div>
                         <div className="bg-neutral-100 rounded-3xl border border-neutral-200 flex items-center justify-center text-neutral-400 text-[10px] font-black uppercase">细节图 C - AI 已生成</div>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-4 pt-10">
                   <button 
                     onClick={() => setIsApprovalDrawerOpen(false)}
                     className="flex-1 py-6 bg-neutral-900 text-white rounded-[32px] text-lg font-black shadow-2xl flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all hover:scale-[1.02] active:scale-95"
                   >
                     <Check size={24} /> 确认并允许分发 (Approve)
                   </button>
                   <button 
                     onClick={() => setIsApprovalDrawerOpen(false)}
                     className="w-24 h-[76px] bg-white border border-neutral-200 text-red-500 rounded-[32px] flex items-center justify-center hover:bg-red-50 transition-all shadow-xl active:scale-95"
                   >
                     <MinusCircle size={28} />
                   </button>
                </div>
              </div>
              
              <div className="mt-auto pt-12 flex items-center justify-between opacity-50">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-400">
                     <ShieldCheck size={16} />
                   </div>
                   <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">操作审计已开启，所有动作由管理员 01 执行</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
