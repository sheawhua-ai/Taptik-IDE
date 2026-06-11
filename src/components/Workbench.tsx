import React, { useState } from 'react';
import { 
  Search, Sparkles, Zap, ArrowRight, Target, BarChart2, 
  Workflow, Layers, MessageSquare, Filter, Star, Orbit,
  Compass, Lightbulb, ZapOff, Bot, Brain, LayoutGrid, RefreshCw,
  ShieldCheck, ArrowUpRight, Cpu, Activity, Share2, CheckCircle2,
  Database, User, Send, FileText, Plus, Check, CalendarDays, LineChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkbenchProps {
  setActiveNav: (nav: string) => void;
  setDataSubNav: (nav: any) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  setOnboardingData: (data: any) => void;
  activeProjectId: string;
}

const SKILL_SHORTCUTS = [
  { 
    id: 'blueocean', 
    name: '蓝海词探测', 
    icon: Target, 
    desc: '深度扫描小红书潜力长尾词', 
    color: 'text-primary-500', 
    bg: 'bg-primary-50',
    nav: 'workflow',
    subNav: 'strategy'
  },
  { 
    id: 'content', 
    name: '爆文生成引擎', 
    icon: Sparkles, 
    desc: '基于行业热点合成网感笔记', 
    color: 'text-purple-500', 
    bg: 'bg-purple-50',
    nav: 'workflow',
    subNav: 'content'
  },
  { 
    id: 'roi', 
    name: '全链路归因', 
    icon: Workflow, 
    desc: '打通曝光到转化的数据黑盒', 
    color: 'text-secondary-500', 
    bg: 'bg-secondary-50',
    nav: 'workflow',
    subNav: 'metrics'
  },
];

const SUGGESTIONS = [
  "为我的宠物零食寻找蓝海关键词",
  "分析行业竞品爆款笔记逻辑",
  "生成 5 篇改写后的爆文草稿",
  "查看当前商户的小红书收录监测"
];

export const Workbench: React.FC<WorkbenchProps> = ({ setActiveNav, setDataSubNav, onboardingStep, setOnboardingStep, setOnboardingData, activeProjectId }) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [leftTab, setLeftTab] = useState<'history' | 'assets'>('history');
  const [messages, setMessages] = useState([
    { role: 'agent', content: '指挥官，根据最新数据巡航，我为您准备了 3 条主动业务建议。', time: '刚才' }
  ]);

  // 主动建议数据
  const [proactiveSuggestions] = useState([
    { 
      id: 's1', 
      type: 'emergency', 
      title: '笔记互动率异常', 
      desc: '您最近发布的 3 篇「宠物粮」笔记互动量下降了 15%，疑被平台限流。',
      action: '立即排查',
      cmd: '分析最近 3 篇笔记的互动波动原因，并给出优化方案'
    },
    { 
      id: 's2', 
      type: 'attention', 
      title: '发现竞品动态', 
      desc: '对标账号「奈雪的茶」刚发布了新品首发笔记，预计 1 小时后达到热度高峰。',
      action: '拆解爆文',
      cmd: '拆解竞品奈雪的茶最新笔记逻辑，提取可借用的爆文模版'
    },
    { 
      id: 's3', 
      type: 'info', 
      title: '排期建议', 
      desc: '基于下周粉丝活跃预测，建议将周五的发布时间从 18:00 提前至 10:00。',
      action: '调整排期',
      cmd: '调整下周五的笔记发布排期至早上 10:00'
    }
  ]);

  // 运营宏定义
  const macros = [
    { name: '周运营助手', icon: CalendarDays, cmd: '执行「周度运营宏」：含趋势分析、蓝海词挖掘、5篇笔记草稿生成及排期' },
    { name: '月度复盘机', icon: LineChart, cmd: '生成上月数据复盘报告，对比竞品 ROI 归因并输出改进建议' },
    { name: '全站矩阵同步', icon: Share2, cmd: '将已审核的 10 篇素材自动适配并同步至所有 KOS 矩阵账号' },
  ];

  const [assets, setAssets] = useState([
    { name: '2024新品发布排期表', type: 'excel', size: '12KB' },
    { name: '产品核心利益点文案', type: 'doc', size: '4KB' },
    { name: '博主拍摄任务清单', type: 'list', size: '8KB' },
  ]);

  const handleExecute = (customQuery?: string) => {
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    const newMsg = { role: 'user', content: finalQuery, time: '刚才' };
    setMessages(prev => [...prev, newMsg]);
    setQuery('');
    setIsProcessing(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'agent', 
        content: `指令「${finalQuery}」已识别。正在自动执行对应业务宏，结果将实时同步至右侧项目看板及资源管线。`, 
        time: '刚才' 
      }]);
      setIsProcessing(false);
    }, 1200);
  };

  const sendCommand = (cmd: string) => {
    handleExecute(cmd);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden text-neutral-900">
      {/* 顶部状态条 - 极简 */}
      <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-8 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
            <Cpu size={16} />
          </div>
          <h2 className="text-[14px] font-black tracking-tight">调度中心 / 指令管线</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            分布式 Agent 节点在线
          </div>
          <button className="flex items-center gap-2 bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-[11px] font-black hover:bg-primary-500 transition-all">
            <Plus size={14} /> 新建营销任务
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左栏：本地资产与快捷宏 */}
        <div className="w-72 border-r border-neutral-100 bg-[#fafafa] flex flex-col overflow-hidden">
          <div className="p-5 border-b border-neutral-100 bg-white">
            <h3 className="text-[12px] font-black text-neutral-400 uppercase tracking-widest mb-4">运营快捷宏</h3>
            <div className="space-y-2">
              {macros.map((macro, i) => (
                <button 
                  key={i} 
                  onClick={() => sendCommand(macro.cmd)}
                  className="w-full flex items-center gap-3 p-3 bg-white border border-neutral-100 rounded-xl hover:border-primary-500 hover:shadow-sm transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-primary-500 transition-colors">
                    <macro.icon size={16} />
                  </div>
                  <span className="text-[12px] font-bold text-neutral-700">{macro.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            <div>
              <h3 className="text-[12px] font-black text-neutral-400 uppercase tracking-widest mb-4">产生的资产</h3>
              <div className="space-y-2">
                {assets.map((asset, i) => (
                  <div key={i} className="p-3 bg-white border border-neutral-100 rounded-xl flex items-center gap-3 group hover:border-primary-500/30 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-primary-500 transition-colors">
                      <FileText size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-black truncate">{asset.name}</div>
                      <div className="text-[9px] text-neutral-400 font-bold uppercase">{asset.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 中栏：核心指挥控制台 */}
        <div className="flex-1 flex flex-col bg-white border-r border-neutral-100 relative">
          <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-[radial-gradient(#f0f0f0_1px,transparent_1px)] [background-size:20px_20px]">
            {/* 主动建议面板 */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-primary-500" />
                <h3 className="text-[14px] font-black tracking-tight">AI 主动业务建议</h3>
              </div>
              {proactiveSuggestions.map(s => (
                <div key={s.id} className="bg-white border border-neutral-100 rounded-[24px] p-6 shadow-sm hover:shadow-xl transition-all border-l-4 group" style={{ borderLeftColor: s.type === 'emergency' ? '#e11d48' : s.type === 'attention' ? '#f59e0b' : '#3b82f6' }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${s.type === 'emergency' ? 'bg-rose-50 text-rose-600' : s.type === 'attention' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                          {s.type === 'emergency' ? '紧急排查' : s.type === 'attention' ? '需关注' : '优化建议'}
                        </span>
                        <h4 className="text-[15px] font-black text-neutral-900">{s.title}</h4>
                      </div>
                      <p className="text-[13px] text-neutral-500 font-medium leading-relaxed">{s.desc}</p>
                    </div>
                    <button 
                      onClick={() => sendCommand(s.cmd)}
                      className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-black hover:bg-primary-500 transition-all shadow-lg active:scale-95"
                    >
                      {s.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 pt-10 border-t border-neutral-100">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'agent' ? 'bg-neutral-900 text-white' : 'bg-primary-500 text-white'}`}>
                      {msg.role === 'agent' ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={`max-w-[85%] space-y-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`px-4 py-3 rounded-2xl text-[13px] font-bold leading-relaxed shadow-sm ring-1 ring-neutral-100 ${msg.role === 'agent' ? 'bg-white text-neutral-800' : 'bg-primary-500 text-white'}`}>
                        {msg.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isProcessing && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center animate-pulse">
                    <Bot size={16} />
                  </div>
                  <div className="flex items-center gap-1 px-3 py-2 bg-neutral-50 rounded-xl">
                     <span className="w-1 h-1 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                     <span className="w-1 h-1 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                     <span className="w-1 h-1 bg-neutral-300 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 border-t border-neutral-100 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="bg-neutral-900 p-1 rounded-[24px] shadow-2xl flex items-center gap-2 px-5 border border-white/10 group focus-within:ring-4 focus-within:ring-primary-500/10 transition-all">
                <Search size={20} className="text-neutral-500" />
                <input 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                  placeholder="请输入您的运营意图（例如：看看明天的排期、分析上周流量数据）..." 
                  className="flex-1 bg-transparent border-none outline-none text-[15px] font-bold text-white placeholder:text-neutral-500 py-4"
                />
                <button 
                  onClick={() => handleExecute()}
                  className="w-12 h-12 bg-white text-neutral-900 rounded-2xl flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all active:scale-95 shadow-lg"
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  意图指令引擎 v4.0 激活
                </div>
                <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                  <Cpu size={12} />
                  上下文感知模式：开启
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右栏：商家项目日历与看板 */}
        <div className="w-96 bg-[#fdfdfd] flex flex-col overflow-hidden">
           <div className="p-6 border-b border-neutral-100 bg-white">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[12px] font-black text-neutral-900 tracking-tight flex items-center gap-2">
                   <CalendarDays size={14} className="text-primary-500" />
                   内容发布日历
                 </h3>
                 <div className="flex gap-1">
                   {['周', '月'].map(t => (
                     <button key={t} className={`px-2 py-0.5 text-[10px] font-black rounded ${t === '周' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:bg-neutral-100'}`}>{t}</button>
                   ))}
                 </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 h-32 mb-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`rounded-xl border flex flex-col items-center justify-center p-1 ${i === 2 ? 'border-primary-500 bg-primary-50' : 'border-neutral-100 bg-neutral-50/50'}`}>
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-tighter">Day {i+10}</span>
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${i % 3 === 0 ? 'bg-emerald-500' : 'bg-neutral-200'}`} />
                  </div>
                ))}
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-black text-emerald-700">自动排期建议</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                </div>
                <p className="text-[10px] text-emerald-600 font-bold leading-relaxed">检测到下周五 10:00 为黄金流量窗口，已由 Agent 预占位。</p>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <h3 className="text-[12px] font-black text-neutral-900 tracking-tight">当前自动化链路</h3>
              {[
                { stage: '全域巡航', status: '完成', icon: Target, detail: '蓝海词「低卡茶饮」热度上升 42%', color: 'text-primary-500' },
                { stage: '智造工坊', status: '执行中', icon: Sparkles, detail: '生成笔记 12 篇，配图任务发送中', color: 'text-purple-500' },
                { stage: '排期分发', status: '待命', icon: Workflow, detail: '计划下周一 10:00 开启首批投放', color: 'text-blue-500' },
                { stage: '数据归因', status: '待命', icon: BarChart2, detail: '等待回流报表', color: 'text-emerald-500' },
              ].map((step, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-neutral-100 pb-2">
                   <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-neutral-100 flex items-center justify-center ${step.status === '完成' ? 'border-emerald-500' : step.status === '执行中' ? 'border-primary-500' : ''}`}>
                      {step.status === '完成' && <Check size={10} className="text-emerald-500" />}
                      {step.status === '执行中' && <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />}
                   </div>
                   <div className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2">
                             <step.icon size={14} className={step.color} />
                             <span className="text-[12px] font-black">{step.stage}</span>
                         </div>
                         <span className="text-[10px] font-bold text-neutral-400 uppercase">{step.status}</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">{step.detail}</p>
                   </div>
                </div>
              ))}
           </div>

        </div>
      </div>
    </div>
  );
};


