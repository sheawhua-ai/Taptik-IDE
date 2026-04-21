import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Database, Zap, Sparkles, ArrowUp, Activity, 
  Clock, Camera, CheckCircle2, ChevronRight, ChevronDown, 
  Folder, FileText, Search, LayoutTemplate, Box, Settings,
  Bot, TerminalSquare, Share2, Check, ArrowRight, Play,
  ListTree, GitCommit, UserSquare2, Command, Slash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & States ---
type TabId = 'grid' | 'editor' | 'automation';

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string | React.ReactNode;
}

interface MentionOption {
  id: string;
  type: '微服务' | '实体门店' | '内容骨架' | '交互人设' | '预设指令';
  label: string;
  icon: React.ElementType;
  color: string;
}

const MENTION_OPTIONS: MentionOption[] = [
  { id: '1', type: '微服务', label: '蓝海词雷达', icon: Search, color: 'text-blue-600' },
  { id: '2', type: '实体门店', label: '上海万象城店', icon: Building2, color: 'text-amber-600' },
  { id: '3', type: '内容骨架', label: '7维避坑骨架', icon: LayoutTemplate, color: 'text-purple-600' },
  { id: '4', type: '交互人设', label: '毒舌专家', icon: UserSquare2, color: 'text-rose-600' },
  { id: '5', type: '实体门店', label: '萧山中宏酒店', icon: Building2, color: 'text-amber-600' },
  { id: '6', type: '预设指令', label: '萧山门店自动流', icon: Zap, color: 'text-blue-500' },
  { id: '7', type: '预设指令', label: '全量预设演示', icon: Box, color: 'text-indigo-600' },
];

// --- Sub-components (Artifacts for Center Workspace) ---

const DataGridArtifact = () => (
  <div className="flex flex-col h-full bg-white p-6">
    <div className="flex justify-between items-end mb-6">
      <div>
        <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
          <Activity size={20} className="text-blue-600" />
          蓝海词数据网格
        </h3>
        <p className="text-sm text-zinc-500 mt-1">智能调取底层数据探针，实时挖掘本地化流量洼地。</p>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1.5 border border-zinc-200 text-sm font-bold rounded shadow-sm hover:bg-zinc-50 transition-colors">筛选因子</button>
        <button className="px-3 py-1.5 border border-zinc-200 text-sm font-bold rounded shadow-sm hover:bg-zinc-50 transition-colors">导出数据</button>
      </div>
    </div>
    
    <div className="flex-1 border border-zinc-200 rounded-lg overflow-hidden flex flex-col shadow-sm">
      <div className="grid grid-cols-5 bg-zinc-50 border-b border-zinc-200 px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">
        <div className="col-span-2">特征长尾词</div>
        <div>搜索热度</div>
        <div>竞争烈度</div>
        <div>趋势预判</div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {[
          { k: '新娘备婚焦虑期怎么度过', v: '98,211', c: '低 (0.24)', t: '+142%', tc: 'text-emerald-600' },
          { k: '萧山露天草坪婚宴防坑指南', v: '45,890', c: '极低 (0.11)', t: '+305%', tc: 'text-emerald-600' },
          { k: '结婚当天伴娘要提前多久到', v: '112,044', c: '中等 (0.55)', t: '+22%', tc: 'text-amber-600' },
          { k: '隐形消费全包套餐怎么谈', v: '88,901', c: '低 (0.31)', t: '+89%', tc: 'text-emerald-600' },
          { k: '试纱一天能试几套最合理', v: '32,109', c: '高 (0.89)', t: '-10%', tc: 'text-rose-600' },
        ].map((row, i) => (
          <div key={i} className="grid grid-cols-5 bg-white border-b border-zinc-100 px-4 py-3.5 text-sm hover:bg-blue-50/50 transition-colors cursor-pointer group">
            <div className="col-span-2 font-medium text-zinc-900 flex items-center gap-2">
              <Search size={14} className="text-zinc-400 group-hover:text-blue-500 transition-colors" /> {row.k}
            </div>
            <div className="font-mono text-zinc-600">{row.v}</div>
            <div className="text-zinc-600">{row.c}</div>
            <div className={`font-mono font-bold ${row.tc}`}>{row.t}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DualEditorArtifact = () => (
  <div className="flex flex-col h-full p-6">
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
          <TerminalSquare size={20} className="text-purple-600" />
          AI 内容双栏解析区
        </h3>
        <p className="text-sm text-zinc-500 mt-1">左侧推演基于指令的骨架草稿，右侧智能剥离结构化的控制任务。</p>
      </div>
      <button className="bg-black text-white px-5 py-2 text-sm font-bold rounded-lg shadow-md hover:bg-zinc-800 transition-colors flex items-center gap-2 active:scale-95">
        <Share2 size={16} /> 确认并派发至门店终端
      </button>
    </div>

    <div className="flex-1 flex gap-6 min-h-0">
      {/* Left: Copywriting */}
      <div className="flex-1 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="bg-zinc-50 border-b border-zinc-200 py-2.5 px-4 text-xs font-bold text-zinc-500 flex justify-between">
          <span>内容草稿预览区</span>
          <span className="text-purple-600 flex items-center gap-1"><UserSquare2 size={12}/> 当前应用人设：毒舌专家</span>
        </div>
        <div className="p-5 overflow-y-auto custom-scrollbar text-sm leading-loose text-zinc-800 font-sans">
          <p className="font-bold text-base mb-3"># 醒醒吧！别让你的草坪婚礼变成农家乐！</p>
          <p className="mb-3 text-zinc-700">
            最近收到后台无数新娘的私信，吐槽在萧山定草坪婚宴踩的巨坑。我真的必须出来骂醒你们！只看草坪大不大，都不看「隐形消费」的吗？
          </p>
          <p className="mb-3 text-zinc-700">
            今天这篇 <span className="max-w-fit px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded font-mono text-xs font-bold cursor-pointer hover:bg-amber-100 transition-colors">@萧山露天草坪婚宴防坑指南</span>，建议直接转发给你老公。
          </p>
          <p className="mb-2 font-bold mt-5 text-zinc-900">踩坑点1：餐标里不包的“进场费”</p>
          <p className="mb-3 text-zinc-700">别以为定了 4999 的餐标就完事儿了，外请四大金刚可能要被收高昂进场费。找酒店谈合同，必须落实这一点！</p>
          <p className="mb-2 font-bold mt-5 text-zinc-900 flex items-center gap-1"><Camera size={14} className="text-purple-600" />视觉要点（将作为分离的任务派派发）：</p>
          <ul className="list-disc pl-5 text-zinc-700 mb-4 space-y-1">
            <li>一定要有一张高级感的<strong className="text-purple-600">暗场全景图</strong>，凸显灯光舞美。</li>
            <li>必须拍一张带高级摆盘的<strong className="text-purple-600">餐标细节图</strong>，打消穷酸顾虑。</li>
            <li>来一张宽阔但不空旷的<strong className="text-purple-600">无遮挡草坪主视角</strong>。</li>
          </ul>
        </div>
      </div>

      {/* Right: Structural Task Extraction */}
      <div className="flex-[0.8] bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col overflow-hidden">
        <div className="bg-zinc-200/50 border-b border-zinc-200 py-2.5 px-4 text-xs font-bold text-zinc-700 flex items-center gap-1.5">
          <Camera size={14} className="text-emerald-600" /> 独立抽离的拍摄任务单
        </div>
        <div className="p-5 overflow-y-auto custom-scrollbar h-full space-y-4">
          <div className="p-4 bg-white border border-emerald-200 rounded-lg shadow-sm relative group hover:border-emerald-400 transition-colors">
            <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">抽离任务 一</div>
            <div className="font-bold text-sm text-zinc-900 mb-1">暗场全景图拍摄</div>
            <p className="text-xs text-zinc-600 mb-3 leading-relaxed">场景要求：凸显宴会厅灯光舞美的高级感，避免杂乱。</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded text-[10px] font-mono font-bold">横屏 16:9</span>
              <span className="px-2 py-1 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded text-[10px] font-mono font-bold">强约束状态：必选项</span>
            </div>
          </div>
          <div className="p-4 bg-white border border-emerald-200 rounded-lg shadow-sm relative group hover:border-emerald-400 transition-colors">
            <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">抽离任务 二</div>
            <div className="font-bold text-sm text-zinc-900 mb-1">餐标细节图抓拍</div>
            <p className="text-xs text-zinc-600 mb-3 leading-relaxed">场景要求：拍摄桌面摆盘细节结构，食物呈现需高级克制。</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded text-[10px] font-mono font-bold">竖屏 3:4</span>
              <span className="px-2 py-1 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded text-[10px] font-mono font-bold">强约束状态：必选项</span>
            </div>
          </div>
          <div className="p-4 bg-white border border-amber-200 rounded-lg shadow-sm relative group hover:border-amber-400 transition-colors">
            <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">抽离任务 三</div>
            <div className="font-bold text-sm text-zinc-900 mb-1">无遮挡草坪主视角</div>
            <p className="text-xs text-zinc-600 mb-3 leading-relaxed">场景要求：空景，体现场地开阔，草坪颜色需饱满。</p>
            <div className="flex gap-2">
               <span className="px-2 py-1 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded text-[10px] font-mono font-bold">横屏 16:9</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AutomationPipelineArtifact = () => (
  <div className="flex flex-col h-full bg-[#fafafa] p-8">
     <div className="mb-10">
      <h3 className="text-2xl font-bold text-zinc-900 flex items-center gap-2 tracking-tight">
        <GitCommit size={24} className="text-emerald-600" />
        自动化流转中枢
      </h3>
      <p className="text-sm text-zinc-500 mt-1">基于您的自然语义解析，自动装配并挂载服务从而形成的流转管线闭环。</p>
    </div>

    <div className="flex-1 flex items-center justify-center">
      <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-xl flex gap-4 items-center ring-1 ring-black/5">
        
        {/* Node 1: Trigger */}
        <div className="w-48 p-5 rounded-xl border border-zinc-200 bg-zinc-50 flex flex-col items-center text-center shadow-sm">
          <Clock size={24} className="text-zinc-600 mb-2" />
          <div className="text-sm font-bold text-zinc-900">节点一：定时触发器</div>
          <div className="text-[11px] font-mono text-zinc-500 bg-white border border-zinc-200 px-3 py-1 mt-3 rounded shadow-sm font-bold">0 9 * * *</div>
          <div className="text-xs text-zinc-500 mt-2">每日上午 9:00</div>
        </div>

        <ArrowRight size={24} className="text-zinc-300" strokeWidth={3} />

        {/* Node 2: Generator */}
        <div className="w-56 p-5 rounded-xl border border-zinc-200 shadow-md bg-white flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-blue-500"></div>
          <Bot size={24} className="text-blue-600 mb-2 mt-1" />
          <div className="text-sm font-bold text-zinc-900">节点二：组合生成逻辑</div>
          <div className="mt-4 w-full space-y-2 flex flex-col items-center">
            <span className="text-[11px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-100 flex items-center gap-1.5 font-bold shadow-sm"><Search size={12}/> @蓝海词雷达</span>
            <span className="text-[11px] bg-purple-50 text-purple-700 px-2.5 py-1 rounded border border-purple-100 flex items-center gap-1.5 font-bold shadow-sm"><LayoutTemplate size={12}/> @7维避坑骨架</span>
          </div>
        </div>

        <ArrowRight size={24} className="text-zinc-300" strokeWidth={3} />

        {/* Node 3: Extractor & Dispatch */}
        <div className="w-56 p-5 rounded-xl border border-zinc-200 shadow-md bg-white flex flex-col items-center text-center relative overflow-hidden">
           <div className="absolute top-0 w-full h-1 bg-emerald-500"></div>
          <Share2 size={24} className="text-emerald-600 mb-2 mt-1" />
          <div className="text-sm font-bold text-zinc-900">节点三：解析与分发</div>
          <p className="text-xs text-zinc-500 mt-3 mb-3 leading-relaxed px-2">自动抽取其中的“视觉要求”，封装为任务单进行下发。</p>
          <div className="text-[11px] bg-amber-50 text-amber-700 px-3 py-1.5 rounded border border-amber-100 font-bold shadow-sm flex items-center gap-1">
            <Building2 size={12}/> 发往：@萧山中宏酒店
          </div>
        </div>

      </div>
    </div>
  </div>
);

// --- Layout Wrapper ---
export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('automation');
  const [inputValue, setInputValue] = useState('');
  const [showMentionPanel, setShowMentionPanel] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', role: 'agent', 
      content: '欢迎使用 TapTik 智能调度控制台。请直接告诉我您的目标。\n\n💡 小贴士：\n1. 输入 `@` 键可以立即查阅或挂载左侧系统的“资产资源库”（例如特定商户或 RAG 文档）。\n2. 键入 `/` 可快速调用下方保存的“预设自动化引擎”。'
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Command & Mention Logic
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // Context Detection matching @ or /
    const mentionMatch = val.match(/[@/]([^\s]*)$/);
    if (mentionMatch) {
      setShowMentionPanel(true);
      setMentionFilter(mentionMatch[1]);
    } else {
      setShowMentionPanel(false);
    }
  };

  const insertMention = (mentionLabel: string) => {
    const isSlash = inputValue.match(/\/([^\s]*)$/);
    const newVal = inputValue.replace(/[@/]([^\s]*)$/, `${isSlash ? '' : '@'}${mentionLabel} `);
    
    // Auto-invoke if it was a slash command (pre-filled instruction test)
    if (isSlash || mentionLabel.includes('预设演示')) {
      setInputValue("你现在是 TapTik 自动化调度中枢。据 @萧山门店自动流 每早 9 点执行：\n1. 从 @蓝海词雷达 获取每日最热的3个痛点。\n2. 注入 @7维避坑骨架 结合痛点生成文案。\n3. 解析文案，抽离提取出视觉强约束，并化为拍摄任务直接下发。\n4. 形成流水系统日志。");
    } else {
      setInputValue(newVal);
    }
    setShowMentionPanel(false);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    pushMessage('user', inputValue);
    setInputValue('');
    setShowMentionPanel(false);

    // Routing Logic
    if (inputValue.includes('自动化') || inputValue.includes('调度') || inputValue.includes('流转')) {
      setActiveTab('automation');
      setTimeout(() => pushMessage('system', '> 后端 Cron Job 注册成功 [0 9 * * *]\n> 已跨端点绑定微服务: [BlueOceanAPI], [7-Dim-Skeleton]'), 500);
      setTimeout(() => pushMessage('agent', '已为您规划并构筑全自动化调度管线闭环！目前控制流将按指令执行以下分派：\n\n- 目标下发点位：萧山中宏酒店\n- 任务触达内容：每日 3 项具体摄像要求核对单\n\n现在您的中央工作区域已无缝切换至「自动化流转中枢」的画布视角。'), 1500);
    } else if (inputValue.includes('骨架') || inputValue.includes('草稿')) {
      setActiveTab('editor');
      setTimeout(() => pushMessage('agent', '根据您的指令，“双栏提纯解析区”已经激活。\n基于指定的骨架和人设，我已经为您推演了完整的长文体系，不仅如此，针对末端的拍摄要求，也已经在右侧栏彻底解耦。请审核！'), 1000);
    } else if (inputValue.includes('蓝海') || inputValue.includes('雷达')) {
      setActiveTab('grid');
      setTimeout(() => pushMessage('agent', '探针服务已挂靠通信。我为您展示了动态化的「蓝海词网格」，最新抓取到的洼地参数尽在掌握中，您可以搭配其他骨架进行转化。'), 800);
    } else {
      setTimeout(() => pushMessage('agent', '您的自由语义指令已接受。若希望构建具体的管线任务，强烈推荐您借助 `@` 加入指定的库资产，或者按 `/` 查看现存的指令池。'), 800);
    }
  };

  const pushMessage = (role: Message['role'], content: React.ReactNode | string) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), role, content }]);
  };

  const injectDemoPrompt = () => {
    setInputValue("你现在是 TapTik 自动化调度中枢。据 @萧山门店自动流 每早 9 点执行：\n1. 从 @蓝海词雷达 获取每日最热的3个痛点。\n2. 注入 @7维避坑骨架 结合痛点生成文案。\n3. 解析文案，抽离提取出视觉强约束，并化为拍摄任务直接下发。\n4. 形成流水系统日志。");
  };

  return (
    <div className="flex h-[100dvh] w-full bg-white font-sans text-zinc-900 overflow-hidden">
      
      {/* 1. Left Panel (Assets Explorer) */}
      <div className="w-[260px] bg-zinc-50/80 border-r border-zinc-200 flex flex-col shrink-0 shadow-[2px_0_12px_rgba(0,0,0,0.02)] relative z-20">
        <div className="h-12 border-b border-zinc-200 flex items-center px-4 justify-between bg-zinc-100/50 shrink-0">
          <span className="font-bold text-[12px] uppercase tracking-[0.1em] text-zinc-600">资产资源库</span>
          <Settings size={14} className="text-zinc-400 cursor-pointer hover:text-black transition-colors" />
        </div>
        
        <div className="p-3 overflow-y-auto space-y-4 custom-scrollbar flex-1 pb-10">
          
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] tracking-wider font-bold text-zinc-400 px-2 py-1 mb-1">
              <ChevronDown size={14} className="text-zinc-400" />
              <Folder size={14} className="text-amber-500"/>
              [组织] 商家/门店矩阵
            </div>
            <div className="pl-6 space-y-0.5">
              <div className="flex items-center gap-2 text-[13px] text-zinc-600 px-2 py-1.5 hover:bg-zinc-200/50 rounded cursor-pointer transition-colors">
                <Building2 size={12} className="text-zinc-400" /> 上海万象城店
              </div>
              <div className="flex items-center gap-2 text-[13px] text-zinc-900 font-bold px-2 py-1.5 bg-white border border-zinc-200 shadow-sm rounded-md cursor-pointer">
                <Building2 size={12} className="text-amber-600"/> 萧山中宏酒店
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] tracking-wider font-bold text-zinc-400 px-2 py-1 mb-1">
              <ChevronDown size={14} className="text-zinc-400" />
              <Database size={14} className="text-emerald-500"/>
              [知识] RAG 事实库
            </div>
            <div className="pl-6 space-y-0.5">
              <div className="flex items-center gap-2 text-[13px] text-zinc-600 px-2 py-1.5 hover:bg-zinc-200/50 rounded cursor-pointer transition-colors">
                <FileText size={12} className="text-zinc-400" /> 门店排期规范.pdf
              </div>
              <div className="flex items-center gap-2 text-[13px] text-zinc-600 px-2 py-1.5 hover:bg-zinc-200/50 rounded cursor-pointer transition-colors">
                <FileText size={12} className="text-zinc-400" /> 隐形消费抗拒话术.md
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] tracking-wider font-bold text-zinc-400 px-2 py-1 mb-1">
                <ChevronDown size={14} className="text-zinc-400" />
                <LayoutTemplate size={14} className="text-purple-500"/>
                [策略] 语料与7维骨架
            </div>
             <div className="pl-6 space-y-0.5">
              <div className="flex items-center gap-2 text-[13px] text-zinc-600 px-2 py-1.5 hover:bg-zinc-200/50 rounded cursor-pointer transition-colors">
                <Box size={12} className="text-zinc-400" /> 备婚避坑起手式
              </div>
              <div className="flex items-center gap-2 text-[13px] text-zinc-900 font-bold px-2 py-1.5 bg-white border border-zinc-200 shadow-sm rounded-md cursor-pointer">
                <Box size={12} className="text-purple-600"/> 强反差干货输出
              </div>
            </div>
          </div>

          {/* Q4 Addition: Saved Skills / Instructions */}
          <div className="space-y-1 pt-3 border-t border-zinc-200/60 mt-4">
            <div className="flex items-center gap-1.5 text-[11px] tracking-wider font-bold text-zinc-500 px-2 py-1 mb-1">
                <ChevronDown size={14} className="text-zinc-500" />
                <Command size={14} className="text-blue-500"/>
                [组件] 已保存自动化指令
            </div>
             <div className="pl-6 space-y-1">
              <div 
                onClick={() => insertMention('萧山门店自动流')}
                className="flex items-center gap-2 text-[13px] text-zinc-900 font-bold px-2 py-1.5 bg-white border border-blue-200 shadow-[0_2px_8px_rgba(59,130,246,0.1)] rounded-md cursor-pointer group"
              >
                <Zap size={12} className="text-blue-500 fill-blue-500 group-hover:animate-pulse"/> 萧山门店调度流.skill
              </div>
              <div className="flex items-center gap-2 text-[13px] text-zinc-600 px-2 py-1.5 hover:bg-zinc-200/50 rounded cursor-pointer transition-colors">
                 <TerminalSquare size={12} className="text-zinc-400" /> 周末批量复盘引擎.skill
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Center Panel (Main Workspace) */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative z-10 shadow-[0_0_40px_rgba(0,0,0,0.03)]">
        {/* Tabs Bar */}
        <div className="h-12 border-b border-zinc-200 flex items-center px-3 bg-zinc-50 shrink-0 gap-1 rounded-t-xl">
          <button 
            onClick={() => setActiveTab('grid')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'grid' ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-zinc-200 text-black font-bold' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50'
            }`}
          >
            <Activity size={14} className={activeTab === 'grid' ? "text-blue-600" : ""} /> 蓝海词网格
          </button>
          <button 
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'editor' ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-zinc-200 text-black font-bold' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50'
            }`}
          >
            <TerminalSquare size={14} className={activeTab === 'editor' ? "text-purple-600" : ""} /> AI双栏解析区
          </button>
          <button 
            onClick={() => setActiveTab('automation')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'automation' ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-zinc-200 text-black font-bold' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50'
            }`}
          >
            <GitCommit size={14} className={activeTab === 'automation' ? "text-emerald-600" : ""} /> 全局调度中枢
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'grid' && (
              <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="absolute inset-0">
                <DataGridArtifact />
              </motion.div>
            )}
            {activeTab === 'editor' && (
               <motion.div key="editor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="absolute inset-0">
                <DualEditorArtifact />
              </motion.div>
            )}
            {activeTab === 'automation' && (
               <motion.div key="automation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="absolute inset-0">
                <AutomationPipelineArtifact />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Right Panel (Copilot / Chat) */}
      <div className="w-[380px] bg-zinc-50/50 border-l border-zinc-200 flex flex-col shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.04)] z-20 relative">
        <div className="h-12 border-b border-zinc-200 flex items-center px-5 justify-between shrink-0 bg-white">
          <span className="font-bold text-[14px] flex items-center gap-2 tracking-tight">
            <Bot size={18} className="text-black" /> AI 调度交互控制台
          </span>
          <button 
            onClick={injectDemoPrompt}
            title="Inject Automation Proposal (Demo)"
            className="text-[11px] bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-md text-zinc-700 hover:bg-black hover:border-black hover:text-white transition-colors cursor-pointer font-bold tracking-widest shadow-sm active:scale-95 flex items-center gap-1.5"
          >
            <Play size={10} fill="currentColor" /> 演示派发流程
          </button>
        </div>

        {/* Action History Folded Section */}
        <div className="border-b border-zinc-200 py-3 px-5 bg-white cursor-pointer hover:bg-zinc-50 transition-colors flex items-center justify-between group shadow-sm z-10">
          <div className="flex items-center gap-2 text-[13px] font-bold text-zinc-700 w-full justify-between pr-2">
            <span className="flex items-center gap-2">
              <ListTree size={16} className="text-zinc-400 group-hover:text-black transition-colors" /> 接口执行追踪流水 (3)
            </span>
            <ChevronDown size={14} className="text-zinc-400 group-hover:text-black transition-colors" />
          </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-zinc-50/50 inner-shadow">
           <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.role === 'system' ? (
                   <div className="w-full font-mono text-[11px] text-zinc-500 p-2.5 border-l-[3px] border-zinc-300 my-1 bg-white shadow-sm rounded-r-md leading-relaxed">
                    {msg.content}
                  </div>
                ) : (
                  <div className={`px-5 py-3.5 rounded-2xl max-w-[92%] text-[13px] leading-relaxed relative ${
                    msg.role === 'user' 
                      ? 'bg-black text-white rounded-br-sm shadow-md' 
                      : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-sm shadow-md'
                  }`}>
                    {msg.role === 'agent' && (
                      <div className="flex items-center gap-1.5 mb-2.5 border-b border-zinc-100 pb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        <Sparkles size={12} className="text-blue-500" /> TapTik L0 大脑
                      </div>
                    )}
                    <div className="whitespace-pre-wrap font-medium">
                      {typeof msg.content === 'string' 
                        ? msg.content.split(/([@/][a-zA-Z0-9\u4e00-\u9fa5]+)/g).map((part, index) => 
                            part.startsWith('@') || part.startsWith('/')
                              ? <span key={index} className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 shadow-sm mx-0.5 inline-block -my-0.5">{part}</span> 
                              : part
                          )
                        : msg.content
                      }
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} className="h-4" />
        </div>

        {/* Input Wrapper with @ Mention Popup */}
        <div className="p-4 border-t border-zinc-200 bg-white shrink-0 relative shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
          
          <AnimatePresence>
            {showMentionPanel && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute bottom-full left-4 right-4 mb-3 bg-white border border-zinc-200 shadow-2xl rounded-xl overflow-hidden py-1.5 z-50 max-h-[260px] overflow-y-auto"
              >
                <div className="px-4 py-2 text-[10px] font-bold text-zinc-500 bg-zinc-50 border-b border-zinc-100 tracking-widest flex items-center justify-between">
                  <span>选择关联实体资产，或装载自动化指令包</span>
                  <span className="font-mono bg-zinc-200 px-1.5 rounded text-zinc-500">退出 ESC</span>
                </div>
                {MENTION_OPTIONS.filter(o => o.label.includes(mentionFilter)).map(opt => (
                  <div 
                    key={opt.id}
                    onClick={() => insertMention(opt.label)}
                    className="px-4 py-3 flex items-center gap-3 hover:bg-zinc-50 cursor-pointer border-b border-zinc-50 last:border-none group transition-colors"
                  >
                    <div className={`p-2 rounded-lg bg-white border border-zinc-200 shadow-sm group-hover:scale-110 transition-transform ${opt.type === '预设指令' ? 'ring-1 ring-blue-100' : ''}`}>
                      <opt.icon size={16} className={opt.color} />
                    </div>
                    <div>
                      <div className={`text-[13px] font-bold ${opt.type === '预设指令' ? 'text-blue-700' : 'text-zinc-900'}`}>{opt.label}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{opt.type}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative bg-zinc-50 border-2 border-zinc-200 hover:border-zinc-300 focus-within:border-black focus-within:bg-white focus-within:ring-4 ring-zinc-200/50 rounded-xl overflow-hidden transition-all shadow-inner">
            <textarea 
              rows={4}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => { 
                if(e.key === 'Enter' && !e.shiftKey) { 
                  e.preventDefault(); 
                  if(showMentionPanel) {
                     const firstMatch = MENTION_OPTIONS.filter(o => o.label.includes(mentionFilter))[0];
                     if(firstMatch) insertMention(firstMatch.label);
                  } else {
                    handleSend(); 
                  }
                }
                if(e.key === 'Escape' && showMentionPanel) {
                  setShowMentionPanel(false);
                }
              }}
              placeholder="请描述您的业务执行需求... &#10;输入 @ 挂载系统资产 | 输入 / 唤出已存指令集"
              className="w-full bg-transparent border-none pl-4 pr-12 py-3.5 text-[13px] text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-0 resize-none font-sans leading-loose font-medium"
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="absolute right-2 bottom-2 p-2.5 rounded-lg bg-black text-white hover:bg-zinc-800 hover:shadow-lg disabled:bg-zinc-200 disabled:text-zinc-400 transition-all active:scale-95"
            >
              <ArrowUp size={16} strokeWidth={2.5} />
            </button>
          </div>
          <div className="text-center mt-3 flex justify-center gap-4 text-[11px] font-mono text-zinc-500 font-bold">
            <span className="flex items-center gap-1"><Command size={12}/> ⌘K 新对话</span>
            <span className="flex items-center gap-1 font-sans">输入 @ 唤醒库资产</span>
            <span className="flex items-center gap-1 font-sans">输入 <Slash size={12}/> 调入指令</span>
          </div>
        </div>
      </div>
    </div>
  );
}
