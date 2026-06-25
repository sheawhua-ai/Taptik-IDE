import fs from 'fs';

const content = `import React, { useState, useEffect } from 'react';
import { 
  Search, Sparkles, Target, BarChart2, Workflow, MessageSquare,
  Compass, Lightbulb, Bot, LayoutGrid, Cpu, Share2, PanelLeftClose, PanelRightClose,
  User, Send, FileText, Plus, Check, CalendarDays, LineChart, PanelLeftOpen, PanelRightOpen, History, FolderOpen, Brain, BookOpen, ArrowUpRight,
  ChevronRight, Wrench, BrainCircuit, CheckCircle2, X, MoreHorizontal, Edit2, Save, Share, Trash2, Folder,
  Copy, Settings, Palette, HelpCircle, ArrowUpCircle, LogOut, Bell, Link2, Gift, UserCircle, Database, ShieldCheck, Users, ShieldAlert, Paperclip, AlertCircle, RefreshCw, FolderDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CommandDirectory } from './command-center/CommandDirectory';
import { AgentSelector, AVAILABLE_AGENTS } from './command-center/AgentSelector';

interface WorkbenchProps {
  setActiveNav: (nav: string) => void;
  setDataSubNav: (nav: any) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  onboardingData: any;
  setOnboardingData: (data: any) => void;
  activeProjectId: string;
}

const CAPSULES = [
  { label: '找蓝海机会', cmd: '帮宠物食品组找本周蓝海词，并生成一批自然流笔记' },
  { label: '生成真人感笔记', cmd: '生成真人感笔记' },
  { label: '巡检账号数据', cmd: '巡检账号数据' },
  { label: '同步飞书任务', cmd: '同步飞书任务' },
];

export const Workbench: React.FC<WorkbenchProps> = ({ setActiveNav, setDataSubNav, onboardingStep, setOnboardingStep, onboardingData, setOnboardingData, activeProjectId }) => {
  const [query, setQuery] = useState('');
  
  const [flowState, setFlowState] = useState<'idle' | 'confirming' | 'executing' | 'result'>('idle');
  const [executionProgress, setExecutionProgress] = useState(0);
  const [showTrace, setShowTrace] = useState(false);
  
  const [isAgentSelectorOpen, setIsAgentSelectorOpen] = useState(false);
  const [isCommandDirOpen, setIsCommandDirOpen] = useState(false);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState('core');
  
  const [targetDestination, setTargetDestination] = useState('写入「宠粮新客运营」项目');

  const activeAgent = AVAILABLE_AGENTS.find(a => a.id === activeAgentId) || AVAILABLE_AGENTS[0];

  const handleExecute = (customQuery?: string) => {
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;
    setQuery(finalQuery);
    setFlowState('confirming');
  };

  const startExecution = () => {
    setFlowState('executing');
    setExecutionProgress(0);
    setShowTrace(false);
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      setExecutionProgress(currentStep);
      if (currentStep >= 6) {
        clearInterval(interval);
        setTimeout(() => setFlowState('result'), 800);
      }
    }, 1200);
  };

  const proactiveSuggestions = [
    { 
      id: 's1', 
      type: '排查', 
      title: '笔记互动率异常', 
      desc: '您最近发布的 3 篇「宠物粮」笔记互动量下降 15%，疑似进入低推荐状态。',
      reason: '建议先排查内容结构与账号健康度。',
      action: '立即排查',
      cmd: '分析最近 3 篇宠物粮笔记的互动下降原因并给出方案',
      color: '#e11d48', bg: 'bg-rose-50', text: 'text-rose-600'
    },
    { 
      id: 's2', 
      type: '机会', 
      title: '发现低粉爆款方向', 
      desc: '「幼犬换粮避坑」近 24 小时出现低粉高互动样本，适合当前宠物食品组做自然流测试。',
      reason: '流量红利期，尽早卡位可获更多免费曝光。',
      action: '生成选题包',
      cmd: '为「幼犬换粮避坑」生成一版选题包，要适合自然流测试',
      color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-600'
    },
    { 
      id: 's3', 
      type: '协同', 
      title: '飞书任务可自动整理', 
      desc: '项目群内有 6 条待处理需求未进入 Taptik 任务流，建议同步并归档。',
      reason: '避免遗漏重要客户跟进。',
      action: '同步任务',
      cmd: '同步飞书项目群内的待处理需求到 Taptik 任务流',
      color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-600'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden text-neutral-900">
      {/* Top Header */}
      <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neutral-900 rounded-xl flex items-center justify-center text-white shadow-md">
            <Cpu size={16} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[16px] font-semibold tracking-tight text-neutral-900 leading-tight">Taptik 总控台</h2>
            <span className="text-[11px] text-neutral-500 font-medium">用自然语言调度运营、内容、数据、协同与知识库能力</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative bg-[#f8fafc]">
        {/* === Middle Panel === */}
        <div className="flex-1 flex flex-col relative min-w-[500px]">
          <div className="flex-1 overflow-y-auto p-10 pb-32 custom-scrollbar flex flex-col items-center">
            
            {/* 1. Idle State */}
            {flowState === 'idle' && (
              <div className="w-full max-w-2xl mt-12 flex flex-col items-center">
                <div className="w-16 h-16 bg-neutral-900 rounded-3xl flex items-center justify-center text-white shadow-[0_12px_40px_rgba(0,0,0,0.15)] mb-8 relative">
                  <Bot size={32} />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border border-white" />
                </div>
                <h2 className="text-[32px] font-semibold text-neutral-900 tracking-tight leading-snug mb-3">
                  今天需要我帮你推进哪件事？
                </h2>
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-12 max-w-lg text-center">
                  你可以直接描述目标，我会判断需要调用的专家、工具和业务流程。
                </p>
              </div>
            )}

            {/* 2. Confirming State */}
            {flowState === 'confirming' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl bg-white rounded-3xl border border-neutral-200 shadow-xl p-8 mt-4">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-100">
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-neutral-900 tracking-tight">执行确认</h3>
                    <p className="text-[13px] text-neutral-500">主 Agent 已为您编排了如下执行流</p>
                  </div>
                </div>

                <div className="space-y-6 text-[14px]">
                  <div>
                    <div className="text-neutral-500 font-medium mb-1.5 text-[12px]">我理解你的目标是：</div>
                    <div className="text-neutral-900 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      {query}
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral-500 font-medium mb-3 text-[12px]">调度链路：主 Agent 将为您编排以下专家与工具</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-[12px] flex items-center gap-1.5 shadow-sm"><Bot size={14}/> 主 Agent</span>
                      <ArrowRight size={14} className="text-neutral-400" />
                      <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-[12px] flex items-center gap-1.5">策略专家</span>
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[12px] flex items-center gap-1.5">内容专家</span>
                      <span className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-[12px] flex items-center gap-1.5">数据专家</span>
                    </div>
                    <div className="text-[13px] text-neutral-600 mt-3 leading-relaxed">
                      将调用 <strong>品牌卖点和禁忌词知识库</strong>，搜索蓝海词与低粉爆款，并生成真人感内容草稿。
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                      <div className="text-emerald-700 font-medium mb-2 text-[12px] flex items-center gap-1.5"><FolderDown size={14} /> 结果落点</div>
                      <select 
                        value={targetDestination}
                        onChange={(e) => setTargetDestination(e.target.value)}
                        className="w-full bg-white border border-emerald-200 text-emerald-800 text-[13px] rounded-lg p-2 outline-none cursor-pointer shadow-sm"
                      >
                        <option>写入「宠粮新客运营」项目</option>
                        <option>新建为独立运营项目</option>
                        <option>派发到飞书/企微项目群</option>
                        <option>沉淀到品牌知识库</option>
                        <option>仅在当前对话保留</option>
                      </select>
                    </div>
                    <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                      <div className="text-rose-700 font-medium mb-2 text-[12px] flex items-center gap-1.5"><ShieldAlert size={14} /> 不会执行 (边界控制)</div>
                      <ul className="text-rose-600 text-[13px] space-y-1">
                        <li>• 不会自动发布笔记</li>
                        <li>• 不会自动发飞书通知客户</li>
                        <li>• 不会自动修改现有达人排期</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center gap-3 justify-end">
                  <button onClick={() => setFlowState('idle')} className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] hover:bg-neutral-50 transition-colors">
                    调整一下
                  </button>
                  <button onClick={startExecution} className="px-8 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] hover:bg-primary-500 shadow-xl shadow-primary-500/20 transition-all active:scale-95 flex items-center gap-2">
                    确认执行 <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. Executing State */}
            {flowState === 'executing' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-white rounded-3xl border border-primary-200 shadow-xl p-8 mt-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-neutral-100">
                  <div className="h-full bg-primary-500 transition-all duration-300 ease-out" style={{ width: \`\${(executionProgress / 6) * 100}%\` }} />
                </div>
                
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 rounded-full border-4 border-primary-100 border-t-primary-500 animate-spin mb-6" />
                  <h3 className="text-[20px] font-semibold text-neutral-900 tracking-tight mb-2">
                    Agent 正在执行任务
                  </h3>
                  <p className="text-[14px] text-neutral-500 text-center max-w-md">
                    正在跨领域调度数据与策略，请稍候。您可以在底部状态栏展开完整执行轨迹。
                  </p>
                </div>
              </motion.div>
            )}

            {/* 4. Result State */}
            {flowState === 'result' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl bg-white rounded-3xl border border-neutral-200 shadow-xl p-8 mt-4 relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <CheckCircle2 size={120} />
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-neutral-900 tracking-tight">已完成蓝海机会分析</h3>
                    <p className="text-[13px] text-neutral-500">结果已成功 {targetDestination}</p>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none text-neutral-600 text-[14px] leading-relaxed mb-8">
                  <p>我为「宠物食品组」找到 <strong>3 个高优可执行方向</strong>：</p>
                  
                  <div className="space-y-4 my-6">
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                      <div className="font-semibold text-neutral-900 mb-1">1. 幼犬换粮避坑 <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded">最推荐</span></div>
                      <p className="text-[13px] m-0 text-neutral-500">自然流机会极强，适合用素人避坑口吻切入，用户防备心低，极易跑出低粉爆款。</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-neutral-200">
                      <div className="font-semibold text-neutral-900 mb-1">2. 国产冻干平替测评</div>
                      <p className="text-[13px] m-0 text-neutral-500">适合测评号发布，作为第二优先级打卡位，能有效拦截竞品流量。</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-neutral-200">
                      <div className="font-semibold text-neutral-900 mb-1">3. 多猫家庭喂养清单</div>
                      <p className="text-[13px] m-0 text-neutral-500">搜索热度稳定，长尾效应好，适合作为长期的自然流内容池。</p>
                    </div>
                  </div>

                  <div className="bg-primary-50 text-primary-800 p-4 rounded-xl border border-primary-100">
                    <strong>主 Agent 建议：</strong><br/>
                    基于当前资产配置，建议先启动 <strong>「幼犬换粮避坑」7 天搜索卡位项目</strong>，调用 A01 测评号和 10 个素人号直接执行。
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-neutral-100">
                  <button onClick={() => { setActiveNav('workflow'); setDataSubNav('strategy'); }} className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-medium hover:bg-primary-500 shadow-md transition-all active:scale-95">
                    开始操盘
                  </button>
                  <button onClick={() => setFlowState('idle')} className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-medium hover:bg-neutral-50 transition-colors">
                    继续深挖
                  </button>
                  <button onClick={() => setFlowState('idle')} className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-medium hover:bg-neutral-50 transition-colors">
                    保存到项目
                  </button>
                </div>
              </motion.div>
            )}

          </div>

          {/* Unified Input Console (Sticky at bottom, over tracing) */}
          <div className="absolute bottom-16 left-0 right-0 px-10 z-40 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/90 to-transparent pt-10 pb-6 pointer-events-none">
            <div className="max-w-3xl mx-auto relative pointer-events-auto shadow-2xl rounded-[32px]">
              
              {flowState === 'idle' && (
                <div className="flex items-center gap-2 mb-3 px-4 flex-wrap">
                  {CAPSULES.map((capsule, i) => (
                    <button 
                      key={i}
                      onClick={() => handleExecute(capsule.cmd)}
                      className="px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 shadow-sm transition-all active:scale-95"
                    >
                      {capsule.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="bg-white p-2.5 rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] flex items-center gap-3 pr-4 border border-neutral-200 focus-within:ring-4 focus-within:ring-primary-500/20 focus-within:border-primary-500/50 transition-all text-neutral-900 relative z-50">
                <button 
                  className="ml-2 px-4 py-2 bg-neutral-900 text-white rounded-[20px] transition-all flex items-center gap-2 shadow-sm shrink-0"
                >
                  <Bot size={18} />
                  <span className="text-[13px] font-medium">主 Agent{flowState === 'executing' ? ' 自动编排中' : ''}</span>
                </button>

                <div className="w-[1px] h-6 bg-neutral-200" />

                <div className="flex-1 relative h-12 flex items-center">
                  <input 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                    placeholder="例如：帮宠物食品组找本周蓝海词，并生成一批自然流笔记"
                    className="absolute inset-0 bg-transparent border-none outline-none text-[15px] text-neutral-900 w-full h-full placeholder:text-neutral-400 placeholder:transition-opacity"
                    disabled={flowState === 'executing'}
                  />
                </div>
                
                <button 
                  onClick={() => handleExecute()}
                  disabled={flowState === 'executing'}
                  className={\`w-12 h-12 rounded-[24px] flex items-center justify-center transition-all active:scale-95 shadow-md shrink-0 \${flowState === 'executing' ? 'bg-neutral-200 text-neutral-400' : 'bg-primary-500 text-white hover:bg-primary-600'}\`}
                >
                  {flowState === 'executing' ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Execution Trace Bar */}
          {flowState === 'executing' && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 transition-all shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              {showTrace && (
                <div className="px-10 py-6 max-h-[300px] overflow-y-auto bg-neutral-50 border-b border-neutral-100">
                  <div className="max-w-3xl mx-auto space-y-4">
                    <div className="text-[13px] font-semibold text-neutral-800 mb-4">Agent 正在执行：宠物食品组蓝海机会分析</div>
                    {[
                      { step: 1, label: '正在读取商家画像' },
                      { step: 2, label: '正在调用品牌知识库' },
                      { step: 3, label: '正在搜索低粉爆款样本' },
                      { step: 4, label: '正在分析账号历史表现' },
                      { step: 5, label: '正在生成选题包' },
                      { step: 6, label: '正在准备内容草稿' },
                    ].map(t => (
                      <div key={t.step} className={\`flex items-center gap-3 text-[13px] \${executionProgress >= t.step ? 'text-neutral-700' : 'text-neutral-400'}\`}>
                        {executionProgress > t.step ? (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        ) : executionProgress === t.step ? (
                          <RefreshCw size={16} className="text-primary-500 animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-neutral-200 shrink-0" />
                        )}
                        <span>{t.step}. {t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="px-10 py-3 flex items-center justify-between max-w-4xl mx-auto cursor-pointer" onClick={() => setShowTrace(!showTrace)}>
                <div className="flex items-center gap-3 text-[13px] text-neutral-700">
                  <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                  <span className="font-medium text-neutral-900">Agent 正在运行：</span>
                  <span className="text-neutral-500">
                    {executionProgress === 1 ? '正在读取商家画像...' :
                     executionProgress === 2 ? '正在调用品牌知识库...' :
                     executionProgress === 3 ? '正在搜索低粉爆款样本...' :
                     executionProgress === 4 ? '正在分析账号历史表现...' :
                     executionProgress === 5 ? '正在生成选题包...' :
                     '正在准备内容草稿...'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-neutral-500 hover:text-primary-600 transition-colors">
                  {showTrace ? '收起执行轨迹' : '展开执行轨迹'}
                  <ChevronRight size={14} className={\`transition-transform \${showTrace ? 'rotate-90' : ''}\`} />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT PANEL: 主动护航引擎 */}
        <div className="w-[300px] 2xl:w-[340px] border-l border-neutral-200 bg-[#fbfbfb] flex flex-col shrink-0 relative z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-5 pb-4 border-b border-neutral-100 flex flex-col gap-1 bg-white shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={18} className="text-primary-500" />
              <span className="text-[15px] font-semibold text-neutral-900 tracking-tight">主动护航</span>
            </div>
            <p className="text-[11px] text-neutral-500">基于当前商家、项目和数据自动发现机会与风险</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#f4f6f8]">
            {proactiveSuggestions.map(s => (
              <div key={s.id} className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group relative">
                <div className="flex items-start justify-between mb-2">
                  <span className={\`text-[10px] px-2 py-0.5 rounded flex-shrink-0 font-medium \${s.bg} \${s.text}\`}>
                    {s.type}
                  </span>
                </div>
                <h4 className="text-[14px] font-semibold text-neutral-900 tracking-tight leading-snug mb-2">{s.title}</h4>
                <p className="text-[13px] text-neutral-600 leading-relaxed mb-3">{s.desc}</p>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 mb-4">
                  <p className="text-[11px] text-neutral-500 leading-relaxed">{s.reason}</p>
                </div>
                
                <button 
                  onClick={() => handleExecute(s.cmd)}
                  className="w-full py-2 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 rounded-xl text-[13px] font-medium transition-colors shadow-sm"
                >
                  {s.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/Workbench.tsx', content);
