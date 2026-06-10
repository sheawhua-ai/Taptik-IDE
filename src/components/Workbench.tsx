import React, { useState } from 'react';
import { 
  Search, Sparkles, Zap, ArrowRight, Target, BarChart2, 
  Workflow, Layers, MessageSquare, Filter, Star, Orbit,
  Compass, Lightbulb, ZapOff, Bot, Brain, LayoutGrid, RefreshCw,
  ShieldCheck, ArrowUpRight, Cpu, Activity, Share2, CheckCircle2,
  Database, User, Send, FileText, Plus, Check
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
  const [history, setHistory] = useState([
    { id: '1', title: '夏季防晒品牌运营计划', time: '刚才', active: true },
    { id: '2', title: '竞品爆款笔记拆解', time: '2小时前', active: false },
    { id: '3', title: 'KOS 账号体系搭建', time: '昨天', active: false },
  ]);

  const [messages, setMessages] = useState([
    { role: 'agent', content: '指挥官，我是您的业务 Agent。当前商家「奈雪的茶」已关联核心知识库，您可以直接下达运营指令。', time: '刚才' }
  ]);

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
        content: `指令「${finalQuery}」已识别。正在调度子集群执行，结果将同步至右侧项目看板。`, 
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
        {/* 左栏：会话历史与本地资产 */}
        <div className="w-72 border-r border-neutral-100 bg-[#fafafa] flex flex-col overflow-hidden">
          <div className="flex border-b border-neutral-100 shrink-0">
            <button 
              onClick={() => setLeftTab('history')}
              className={`flex-1 py-3 text-[12px] font-black transition-all ${leftTab === 'history' ? 'bg-white text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              会话历史
            </button>
            <button 
              onClick={() => setLeftTab('assets')}
              className={`flex-1 py-3 text-[12px] font-black transition-all ${leftTab === 'assets' ? 'bg-white text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              产生的资产
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {leftTab === 'history' ? (
              <div className="space-y-2">
                {history.map(item => (
                  <button key={item.id} className={`w-full text-left p-3 rounded-xl border transition-all ${item.active ? 'bg-white border-neutral-200 shadow-sm' : 'border-transparent hover:bg-neutral-100 opacity-60 hover:opacity-100'}`}>
                    <div className="text-[12px] font-black mb-1 truncate">{item.title}</div>
                    <div className="text-[10px] text-neutral-400 font-bold uppercase">{item.time} 更新</div>
                  </button>
                ))}
              </div>
            ) : (
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
            )}
          </div>
        </div>

        {/* 中栏：核心对话窗口 */}
        <div className="flex-1 flex flex-col bg-white border-r border-neutral-100 relative">
          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            <AnimatePresence>
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
                    <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ring-1 ring-neutral-100 ${msg.role === 'agent' ? 'bg-neutral-50 text-neutral-800' : 'bg-primary-500 text-white'}`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
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
            </AnimatePresence>
          </div>

          <div className="p-6 pb-8 border-t border-neutral-100">
            <div className="space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                 {[
                   { label: '蓝海词探测', cmd: '启动深度蓝海词扫描，分析宠物粮赛道潜力增长点' },
                   { label: '生成排期', cmd: '基于当前选题，自动规划下周的小红书发布排期表' },
                   { label: '笔记改写', cmd: '将选中的 3 篇对标笔记进行小红书网感改写' },
                   { label: 'ROI分析', cmd: '导出本周商户投放的归因数据报表' }
                 ].map((action, i) => (
                   <button 
                    key={i} 
                    onClick={() => sendCommand(action.cmd)}
                    className="shrink-0 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[11px] font-black text-neutral-500 hover:border-primary-500 hover:text-primary-500 transition-all"
                   >
                     {action.label}
                   </button>
                 ))}
              </div>
              <div className="bg-neutral-900 p-1 rounded-2xl shadow-xl flex items-center gap-2 px-4 shadow-neutral-900/10 border border-white/5">
                 <input 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                    placeholder="请输入业务指令..." 
                    className="flex-1 bg-transparent border-none outline-none text-[14px] font-bold text-white placeholder:text-neutral-500 py-3"
                 />
                 <button 
                  onClick={() => handleExecute()}
                  className="w-10 h-10 bg-white text-neutral-900 rounded-xl flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all active:scale-95"
                 >
                   <Send size={18} />
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* 右栏：商家项目看板 */}
        <div className="w-80 bg-[#fdfdfd] flex flex-col overflow-hidden">
           <div className="p-6 border-b border-neutral-100 bg-white">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[12px] font-black text-neutral-900 tracking-tight">商家项目进展</h3>
                 <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded border border-emerald-100 uppercase">投放中</div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-center text-lg">🍵</div>
                 <div>
                    <div className="text-[13px] font-black">奈雪的茶 - 夏季运营</div>
                    <div className="text-[10px] text-neutral-400 font-bold">全链路自动调度已开启</div>
                 </div>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {[
                { stage: '业务探查', status: '完成', icon: Target, detail: '蓝海词「低卡茶饮」热度上升 42%', color: 'text-primary-500' },
                { stage: '内容智造', status: '执行中', icon: Sparkles, detail: '生成笔记 12 篇，配图任务发送中', color: 'text-purple-500' },
                { stage: '排期分发', status: '待命', icon: Workflow, detail: '计划下周一 10:00 开启首批投放', color: 'text-blue-500' },
                { stage: '数据反馈', status: '待命', icon: BarChart2, detail: '等待首批回流数据', color: 'text-emerald-500' },
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

              <div className="pt-4">
                 <button className="w-full py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[12px] font-black text-neutral-600 hover:border-primary-500 hover:text-primary-500 transition-all flex items-center justify-center gap-2">
                    <RefreshCw size={14} /> 刷新看板状态
                 </button>
              </div>
           </div>

           <div className="p-6 bg-neutral-900 border-t border-white/5 mt-auto">
              <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">系统运行效能</div>
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-bold text-white/60">
                    <span>向量库匹配度</span>
                    <span>98.2%</span>
                 </div>
                 <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[98%] h-full bg-primary-500" />
                 </div>
                 <div className="flex justify-between text-[10px] font-bold text-white/60 pt-1">
                    <span>自动化节约工时</span>
                    <span>42h / 周</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};


