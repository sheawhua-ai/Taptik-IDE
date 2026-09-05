// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Image as ImageIcon, Workflow, FileText, CheckCircle2, ChevronRight, Hash, 
  Target, Sparkles, X, ChevronDown, ListFilter, Play, ArrowRight, Activity, Zap, MessageSquare, Plus, Lock, 
  Copy, Settings, Palette, HelpCircle, ArrowUpCircle, ArrowUpRight, LogOut, Bell, Link2, Gift, UserCircle, Database, ShieldCheck, Users, ShieldAlert, Paperclip, ArrowDownRight, PieChart, LineChart, Lightbulb, Cpu, PanelLeftOpen, PanelRightClose, Folder, Search, Network, Loader2, Check, FileCode
, Triangle, Github, Hand, Terminal, Mic, AudioLines, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AgentSelector, AVAILABLE_AGENTS } from './command-center/AgentSelector';
import { SmartInput } from './SmartInput';
import { ProjectFilePanel } from './ProjectFilePanel';
import { File , Triangle, Github, Hand, Terminal, Mic, AudioLines, ArrowUp } from 'lucide-react';


export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  time: string;
  isThinking?: boolean;
  isCancelled?: boolean;
  thoughts?: { id: string; type: string; content: string }[];
  card?: any;
}

interface WorkbenchProps {
  setActiveNav: (nav: string) => void;
  setDataSubNav: (nav: string) => void;
  isNewMerchant?: boolean;
  setOnboardingData?: (data: any) => void;
  onboardingData?: any;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  setWorkflowTab?: (tab: any) => void;
  messages?: ChatMessage[];
  setMessages?: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  activeProjectId?: string;
}

const QUICK_SHORTCUTS = [
  { id: '1', name: '商家画像', action: '帮我生成商家画像。' },
  { id: '2', name: '蓝海词挖掘', action: '帮我挖掘蓝海词。' },
  { id: '3', name: '选题规划', action: '帮我做个选题规划。' },
  { id: '4', name: '爆款拆解', action: '帮我拆解一下这个爆款。' }
];

const SUGGESTIONS = ['生成商品文案', '分析用户数据', '优化运营策略'];

export const Workbench: React.FC<WorkbenchProps> = ({
  setActiveNav, setDataSubNav, isNewMerchant, setOnboardingData, onboardingData, onboardingStep, setOnboardingStep, setWorkflowTab, messages: propMessages, setMessages: propSetMessages, activeProjectId
}) => {
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  
  const messages = propMessages || localMessages;
  const setMessages = propSetMessages || setLocalMessages;

  const [query, setQuery] = useState('');
  const [selectedShortcut, setSelectedShortcut] = useState<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
    const [isAgentSelectorOpen, setIsAgentSelectorOpen] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState('taptik-ai');
  const [isCommandDirOpen, setIsCommandDirOpen] = useState(false);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isApprovalMenuOpen, setIsApprovalMenuOpen] = useState(false);
  const [approvalMode, setApprovalMode] = useState<'request' | 'auto'>('auto');
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'fast' | 'extreme'>('fast');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [bottomExpanded, setBottomExpanded] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [filePanelOpen, setFilePanelOpen] = useState(true);
  const [openedTabs, setOpenedTabs] = useState<any[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('workbench');
  const [references, setReferences] = useState<any[]>([]);
  const [dragTargetNode, setDragTargetNode] = useState<any>(null);

  const handleDragStartNode = (e: React.DragEvent, node: any) => {
    setDragTargetNode(node);
  };



  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % SUGGESTIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 300) + 'px';
    }
  }, [query, selectedShortcut]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (activeProjectId === 'project-b') {
      if (dragTargetNode) {
        setReferences(prev => {
          if (prev.find(r => r.id === dragTargetNode.id)) return prev;
          return [...prev, {
            id: dragTargetNode.id,
            name: dragTargetNode.name,
            type: dragTargetNode.type,
            status: 'ready',
            pinned: false
          }];
        });
        setDragTargetNode(null);
      } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        setReferences(prev => [...prev, {
          id: `ext_${Date.now()}`,
          name: file.name,
          type: 'file',
          status: 'ready',
          pinned: false,
          isExternal: true
        }]);
      }
    }
  };


  const handleAddContext = (sug: any) => {
    setQuery(sug.action || sug.title);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleToggleProgress = (id: string) => {
    setMessages((prev: any) => prev.map((m: any) => {
      if (m.id === id && m.card && m.card.type === 'progress') {
        return { ...m, card: { ...m.card, isExpanded: !m.card.isExpanded } };
      }
      return m;
    }));
  };

  const handleConfirmExecute = (id: string, cmd: string) => {
    setMessages((prev: any) => prev.map((m: any) => {
      if (m.id === id) {
        return {
          ...m,
          card: {
            type: 'progress',
            currentStep: '正在解析任务参数',
            completedCount: 0,
            totalCount: 3,
            isExpanded: false,
            steps: [
              { title: '解析任务参数', status: 'active' },
              { title: '提取历史爆款数据', status: 'pending' },
              { title: '生成并写入项目文件', status: 'pending' }
            ]
          }
        };
      }
      return m;
    }));

    setTimeout(() => {
      setMessages((prev: any) => prev.map((m: any) => {
        if (m.id === id) {
          return {
            ...m,
            card: {
              type: 'result',
              title: '内容任务创建成功',
              artifacts: [
                { id: '1', name: '宠粮新客运营小红书笔记_v1.md', path: '项目/宠粮新客运营', size: '2 KB', isNew: true },
                { id: '2', name: '项目排期.xlsx', path: '项目/宠粮新客运营', size: '15 KB', isUpdated: true }
              ],
              suggestions: [
                { id: '1', title: '分析竞品数据', desc: '根据最新爆款生成竞品对比', action: '帮我分析同类竞品爆款' },
                { id: '2', title: '调整排期时间', desc: '将首发时间推迟到下周五', action: '把排期时间延后一周' }
              ]
            }
          };
        }
        return m;
      }));
    }, 2000);
  };

  const handleOpenFile = (artifact: any) => {
    // 预留文件预览右侧抽屉回调
    console.log("Open file preview drawer for:", artifact);
    if (activeProjectId === 'project-b') {
        if (!openedTabs.find(t => t.id === artifact.id)) {
            setOpenedTabs((prev: any) => [...prev, { id: artifact.id, name: artifact.name, type: 'file' }]);
        }
        setActiveTabId(artifact.id);
    }
  };

  const handleExecute = (customQuery?: string) => {
    let finalQuery = customQuery || query;
    
    if (selectedShortcut && !customQuery) {
      if (selectedShortcut.action === '') {
        finalQuery = `[${selectedShortcut.name}] ${finalQuery}`.trim();
      } else if (!finalQuery.includes(selectedShortcut.name) && !finalQuery.includes(selectedShortcut.action)) {
        finalQuery = `[${selectedShortcut.name}] ${finalQuery}`.trim();
      }
    }
    
    if (!finalQuery.trim()) {
      if (selectedShortcut && selectedShortcut.action === '') {
        finalQuery = `执行技能：${selectedShortcut.name}`;
      } else {
        return;
      }
    }

    setSelectedShortcut(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMsgId = Math.random().toString(36).substring(2);
    const agentMsgId = Math.random().toString(36).substring(2);

    const newMsg: ChatMessage = { id: userMsgId, role: 'user', content: finalQuery, time: '刚才' };
    setMessages(prev => [...prev, newMsg]);
    setQuery('');
    
    const agentMsg: ChatMessage = {
      id: agentMsgId,
      role: 'agent',
      content: '',
      time: '刚才',
      isThinking: true,
      thoughts: []
    };
    
    setMessages(prev => [...prev, agentMsg]);
    setIsProcessing(true);

    if (isNewMerchant) {
      let step = 0;
      const stages = [
        { type: 'think', content: '正在分析您的输入并提取品牌语义特征...' }
      ] as any[];

      const interval = setInterval(() => {
        if (step < stages.length) {
          const currentStep = step;
          const stage = stages[currentStep];
          setMessages(prev => prev.map(m => {
            if (m.id === agentMsgId) {
              const newThoughts = [...(m.thoughts || []), { id: `t${currentStep}`, ...stage }];
              return { ...m, thoughts: newThoughts };
            }
            return m;
          }));
          step++;
        } else {
          clearInterval(interval);
          if (onboardingStep === 0) {
            setTimeout(() => setOnboardingData((prev: any) => ({ ...prev, industry: "美妆护肤", audience: "18-25岁 年轻女大学生" })), 0);
            setMessages(prev => prev.map(m => m.id === agentMsgId ? {
              ...m,
              isThinking: false,
              content: '✅ 收到！看来我们的核心是**“敏感肌可用卸妆油”**，主要受众群是**年轻女大学生**。\n\n那么，在文案风格上，您希望我们是“专业严谨的护肤专家”，还是“贴心分享的闺蜜种草”？是否有绝对不能碰的竞品或防坑雷区（比如不要提平替）？'
            } : m));
            setOnboardingStep(1);
          } else if (onboardingStep === 1) {
            setTimeout(() => setOnboardingData((prev: any) => ({ ...prev, traps: "避免拉踩、不提平替", tone: "闺蜜种草，亲切活泼" })), 0);
            setMessages(prev => prev.map(m => m.id === agentMsgId ? {
              ...m,
              isThinking: false,
              content: '✅ 非常清晰！已经收到您的防坑雷区与品牌声调预设，并同步为全域智体的底层系统护栏。\n\n🎉 **您的品牌画像基座已初始完成！**\n\n现在您可以解锁左侧的「项目工作流」进行实操，或者点击我下方的按钮，一键生成第一季度的打法节奏。'
            } : m));
            setOnboardingStep(3);
          } else {
            setMessages(prev => prev.map(m => m.id === agentMsgId ? {
              ...m,
              isThinking: false,
              content: '基座已建设完毕，正为您执行具体的工作指令。'
            } : m));
            setTimeout(() => setActiveNav('workflow'), 1000);
          }
          setIsProcessing(false);
        }
      }, 1000);
      return;
    }

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === agentMsgId ? {
        ...m,
        isThinking: false,
        card: {
          type: 'confirmation',
          goal: `为您执行：${finalQuery}`,
          tools: ['策略专家：搜索蓝海词和低粉爆款', '内容专家：生成真人感笔记', '数据专家：参考历史账号表现'],
          destinations: ['宠粮新客运营项目', '内容车间草稿区'],
          wontDo: ['自动发布', '自动修改排期'],
          recommendedDestination: '写入「宠粮新客运营」项目，并生成内容任务',
          cmd: finalQuery
        }
      } : m));
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f6f6f6] overflow-hidden text-text-main">
      
      
      {/* Top Header with Tabs */}
      <div className="h-[46px] border-b border-border-default flex items-end px-2 bg-[#f2f2f2] shrink-0 z-20 overflow-x-auto custom-scrollbar">
        {activeProjectId === 'project-b' && (
          <div className="flex items-center gap-1 mb-1.5 mr-2">
            <button
              onClick={() => setFilePanelOpen(!filePanelOpen)}
              className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${filePanelOpen ? 'bg-neutral-200/50 text-text-main' : 'text-text-tertiary hover:bg-selected-bg/50 hover:text-text-main'}`}
              title="切换项目文件"
            >
              <PanelLeftOpen size={16} />
            </button>
          </div>
        )}
        
        {/* Tabs Container */}
        <div className="flex items-end h-full gap-1">
          {/* Workbench Tab */}
          <div 
            onClick={() => setActiveTabId('workbench')}
            className={`group relative h-[36px] flex items-center gap-2 px-4 min-w-[120px] max-w-[200px] rounded-t-lg border-t border-x cursor-pointer transition-all ${activeTabId === 'workbench' ? 'bg-surface-1 border-border-default/80 text-text-main z-10' : 'bg-transparent border-transparent text-text-tertiary hover:bg-selected-bg/30'}`}
          >
            {activeTabId === 'workbench' && <div className="absolute -bottom-[1px] left-0 right-0 h-[1px] bg-surface-1 z-20"></div>}
            <MessageSquare size={14} className={activeTabId === 'workbench' ? 'text-neutral-800' : ''} />
            <span className="text-[13px] font-medium truncate">工作台</span>
          </div>

          {/* Opened Files Tabs */}
          {openedTabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`group relative h-[36px] flex items-center justify-between gap-3 px-3 pr-2 min-w-[120px] max-w-[200px] rounded-t-lg border-t border-x cursor-pointer transition-all ${activeTabId === tab.id ? 'bg-surface-1 border-border-default/80 text-text-main z-10' : 'bg-transparent border-transparent text-text-tertiary hover:bg-selected-bg/30'}`}
            >
              {activeTabId === tab.id && <div className="absolute -bottom-[1px] left-0 right-0 h-[1px] bg-surface-1 z-20"></div>}
              <div className="flex items-center gap-2 overflow-hidden">
                <File size={14} />
                <span className="text-[13px] font-medium truncate">{tab.name}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const newTabs = openedTabs.filter(t => t.id !== tab.id);
                  setOpenedTabs(newTabs);
                  if (activeTabId === tab.id) {
                    setActiveTabId(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : 'workbench');
                  }
                }}
                className={`p-0.5 rounded transition-colors ${activeTabId === tab.id ? 'text-text-tertiary hover:bg-hover-bg hover:text-text-main' : 'text-transparent group-hover:text-text-tertiary hover:bg-selected-bg/50 hover:!text-text-main'}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>



      
      <div className="flex-1 flex overflow-hidden relative bg-[#f7f7f7]">
        {activeProjectId === 'project-b' && (
          <ProjectFilePanel 
            isOpen={filePanelOpen} 
            onClose={() => setFilePanelOpen(false)} 
            onDragStartNode={handleDragStartNode} 
            onNodeDoubleClick={(node) => {
              if (node.type !== 'folder' && node.type !== 'system_group') {
                if (!openedTabs.find(t => t.id === node.id)) {
                  setOpenedTabs(prev => [...prev, node]);
                }
                setActiveTabId(node.id);
              }
            }}
          />
        )}
        {activeTabId === 'workbench' ? (
          <>
        {/* === Floating Timeline (Conversation History) === */}
        {messages.length > 0 && (
          <div className="absolute left-0 top-0 bottom-0 w-8 z-50 flex flex-col py-10 group/timeline">
            {/* The vertical line */}
            <div className="absolute left-3 top-10 bottom-10 w-[2px] bg-neutral-200 group-hover/timeline:bg-neutral-300 transition-colors rounded-full" />
            
            {messages.map((msg, idx) => {
              if (msg.role === 'agent') return null;
              return (
                <div 
                  key={msg.id} 
                  className="relative py-1.5 flex items-center w-full cursor-pointer group/item z-10 pl-2"
                  onClick={() => {
                    const el = document.getElementById(`msg-${msg.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                >
                  <div className="w-2.5 h-[2px] bg-neutral-400 group-hover/item:w-4 group-hover/item:bg-neutral-800 group-hover/item:-translate-x-1 transition-all rounded-full relative z-10" />
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-all bg-surface-1 border border-[#E5EAF1] shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-3 w-64 z-[100] pointer-events-none origin-left scale-95 group-hover/item:scale-100 duration-200">
                    <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-surface-1 border-l border-b border-[#E5EAF1] rotate-45" />
                    <p className="text-[13px] text-text-main line-clamp-3 leading-relaxed relative z-10">
                      {msg.content || "快捷指令"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* === Middle Panel (Console Display) === */}
        <div
          className="flex-1 flex flex-col relative min-w-[480px]"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          
          {isDragging && activeProjectId === 'project-b' ? (
            <div className="absolute inset-0 z-50 bg-[#F03E3E]/[0.04] backdrop-blur-[1px] border-[1.5px] border-dashed border-[#F03E3E] rounded-xl m-4 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-16 h-16 bg-surface-1 rounded-xl shadow-xl flex items-center justify-center text-[#F03E3E] mb-4">
                <Plus size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#F03E3E] tracking-tight">
                松开以添加 @ 引用
              </h3>
              {dragTargetNode && (
                <p className="text-[14px] font-medium text-[#F03E3E]/80 mt-2 bg-surface-1/80 px-4 py-1.5 rounded-full shadow-sm">
                  {dragTargetNode.type === 'folder' ? `文件夹：${dragTargetNode.name}` : `文件：${dragTargetNode.name}`}
                </p>
              )}
            </div>
          ) : isDragging && (
            <div className="absolute inset-0 z-50 bg-neutral-900/[0.04] backdrop-blur-[2px] border-2 border-dashed border-neutral-500 rounded-xl m-4 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-16 h-16 bg-surface-1 rounded-xl shadow-xl flex items-center justify-center text-neutral-700 mb-4 animate-bounce">
                <Paperclip size={32} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 tracking-tight">
                松开以上传文件
              </h3>
              <p className="text-[13px] text-neutral-500 mt-2">
                支持本地文件、文件夹拖拽上传
              </p>
            </div>
          )}


          <div
            className={`flex-1 overflow-y-auto p-10 pb-6 space-y-10 custom-scrollbar ${isDragging ? "opacity-50" : ""}`}
          >
            {/* Clean Startup Screen (New Task / Empty State) */}
            {(messages.length === 0 ||
              (messages.length === 1 && messages[0].role === "agent")) && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 mt-8">
                <h2 className="text-[28px] font-semibold text-text-main tracking-tight leading-snug mb-3">
                  {isNewMerchant
                    ? "欢迎入驻，开始构建您的专属品牌诊断"
                    : "今天需要我帮您做些什么？"}
                </h2>
                <p className="text-[14px] text-text-secondary leading-relaxed mb-10 max-w-lg">
                  {isNewMerchant
                    ? "系统检测到您为新入驻账号，建议先由「策略专家」为您进行深度的品牌诊断与受众画像对焦，建立精准的内容基座。"
                    : "您可以直接下达任务指令，或唤起垂直方向的专业智能体为您处理数据、策略或内容。"}
                  {activeProjectId === 'project-b' && (
                    <span className="block mt-2 text-neutral-500">直接输入任务，或拖入文件和文件夹作为上下文。</span>
                  )}
                </p>

                {isNewMerchant && (
                  <button
                    onClick={() => {
                      setActiveAgentId("strategy");
                      handleExecute(
                        "你好，我是新入驻的商家，请帮我对焦品牌受众和产品卖点，建立出圈模型。",
                      );
                    }}
                    className="px-8 py-3.5 bg-neutral-950 text-white rounded-xl text-[14px] hover:bg-neutral-800 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Target size={18} /> 开启品牌深度诊断
                  </button>
                )}
              </div>
            )}

            <div
              className={`max-w-[880px] mx-auto space-y-8 pt-6 ${!isNewMerchant ? "border-t border-[#E5EAF1]" : ""}`}
            >
              <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => (
                  <motion.div
                    id={`msg-${msg.id}`}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    layout
                    key={msg.id}
                    className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] space-y-2 mt-1 ${msg.role === "user" ? "flex flex-col items-end" : ""}`}
                    >
                      {msg.thoughts && msg.thoughts.length > 0 && (
                        <ThoughtsBlock
                          thoughts={msg.thoughts}
                          isThinking={msg.isThinking || false}
                        />
                      )}
                      {msg.content && (
                        <div
                          className={`text-left text-[14px] leading-relaxed inline-block ${msg.isCancelled ? "text-[#98A2B3]" : msg.role === "agent" ? "text-text-main" : "bg-[#e9e9e9] text-neutral-900 px-5 py-3 rounded-2xl rounded-tr-md"}`}
                        >
                          <div className={`prose prose-sm max-w-none ${msg.isCancelled ? "line-through opacity-70 prose-neutral" : "prose-neutral"}`}>
                            {msg.content}
                          </div>
                        </div>
                      )}
                      {msg.card && msg.card.type === "confirmation" && (
                        <div className="mt-3 bg-surface-1 border border-[#E5EAF1] rounded-xl p-5 shadow-sm text-left relative overflow-hidden text-text-main w-full max-w-[880px]">
                          <div className="mb-4">
                            <h4 className="text-[14px] font-semibold text-text-main mb-1">
                              需要您确认
                            </h4>
                            <p className="text-[13px] text-text-secondary leading-relaxed">
                              {msg.card.goal}
                            </p>
                          </div>

                          <div className="mb-5 bg-[#F6F8FB] p-3 rounded-xl border border-[#E5EAF1]">
                            <h4 className="text-[13px] font-medium text-text-secondary mb-1">执行影响</h4>
                            <p className="text-[13px] text-text-main">{msg.card.recommendedDestination}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                handleConfirmExecute(msg.id, msg.card!.cmd)
                              }
                              className="px-6 py-2 bg-neutral-950 text-white hover:bg-neutral-800 rounded-xl text-[13px] font-medium transition-colors cursor-pointer"
                            >
                              确认执行
                            </button>
                            <button className="px-6 py-2 bg-surface-1 text-text-main hover:bg-[#F6F8FB] rounded-xl text-[13px] font-medium transition-colors border border-[#E5EAF1] cursor-pointer">
                              取消
                            </button>
                          </div>
                        </div>
                      )}

                      {msg.card && msg.card.type === "progress" && (
                        <div className="mt-3 bg-surface-1 border border-[#E5EAF1] rounded-xl shadow-sm text-left relative overflow-hidden text-text-main w-full max-w-[880px]">
                          <div
                            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#F6F8FB]"
                            onClick={() => handleToggleProgress(msg.id)}
                          >
                            <div className="flex items-center gap-3">
                              <Loader2
                                size={16}
                                className="animate-spin text-[#98A2B3]"
                              />
                              <span className="text-[13px] font-medium text-text-secondary">
                                正在处理 · {msg.card.currentStep || '执行中'} · {msg.card.completedCount || 0}/{msg.card.totalCount || (msg.card.steps?.length || 1)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[#98A2B3] hover:text-text-secondary">
                              <span className="text-[13px]">展开详情</span>
                              <ChevronDown
                                size={14}
                                className={`transition-transform ${msg.card.isExpanded ? "rotate-180" : ""}`}
                              />
                            </div>
                          </div>

                          <AnimatePresence>
                            {msg.card.isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 pt-0 border-t border-[#E5EAF1]">
                                  <div className="space-y-3 mt-4">
                                    {msg.card.steps?.map((step, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-3"
                                      >
                                        <div
                                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${step.status === "completed" ? "bg-[#2FA879]/10 text-[#2FA879]" : step.status === "active" ? "bg-neutral-950 text-white" : "bg-[#F6F8FB] text-[#98A2B3]"}`}
                                        >
                                          {step.status === "completed" ? (
                                            <Check size={12} />
                                          ) : step.status === "active" ? (
                                            <Loader2
                                              size={12}
                                              className="animate-spin"
                                            />
                                          ) : (
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#98A2B3]" />
                                          )}
                                        </div>
                                        <span
                                          className={`text-[13px] ${step.status === "completed" ? "text-text-main" : step.status === "active" ? "text-neutral-900 font-medium" : "text-[#98A2B3]"}`}
                                        >
                                          {step.title}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {msg.card && msg.card.type === "result" && (
                        <div className="mt-4 space-y-4 max-w-[880px]">
                          {/* Artifacts Block */}
                          {msg.card.artifacts && msg.card.artifacts.length > 0 && (
                            <div className="bg-surface-1 border border-[#E5EAF1] rounded-xl overflow-hidden shadow-sm">
                              <div className="px-4 py-3 border-b border-[#E5EAF1] bg-[#F6F8FB]/50 flex items-center justify-between">
                                <h4 className="text-[13px] font-semibold text-text-main flex items-center gap-2">
                                  <FileCode size={16} className="text-[#98A2B3]"/>
                                  本轮产物 <span className="text-text-secondary font-normal">({msg.card.artifacts.length})</span>
                                </h4>
                              </div>
                              <div className="divide-y divide-[#E5EAF1]">
                                {msg.card.artifacts.map((artifact: any) => (
                                  <div key={artifact.id} className="p-3 hover:bg-[#F6F8FB] transition-colors flex items-center gap-3 group">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${artifact.isNew ? 'bg-neutral-100 text-neutral-700' : 'bg-[#F2F5F9] text-[#98A2B3]'}`}>
                                      <File size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleOpenFile(artifact)}>
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[13px] font-medium text-text-main truncate">{artifact.name}</span>
                                        {artifact.isNew && <span className="text-[13px] px-1.5 py-0.5 bg-neutral-100 text-neutral-700 rounded font-medium border border-neutral-200">新建</span>}
                                        {artifact.isUpdated && <span className="text-[13px] px-1.5 py-0.5 bg-[#F6F8FB] text-text-secondary rounded font-medium border border-[#E5EAF1]">更新</span>}
                                      </div>
                                      <p className="text-[13px] text-[#98A2B3] truncate">{artifact.path} · {artifact.size}</p>
                                    </div>
                                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#98A2B3] hover:text-text-main hover:bg-[#E5EAF1] opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                      <Search size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Suggestions Block */}
                          {msg.card.suggestions && msg.card.suggestions.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between mt-6 px-1">
                                <h4 className="text-[13px] font-medium text-[#98A2B3]">接下来建议</h4>
                                {msg.card.suggestions.length > 2 && (
                                  <button className="text-[13px] text-text-secondary hover:text-neutral-950 transition-colors flex items-center gap-1 cursor-pointer">
                                    更多建议 <ChevronRight size={12} />
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                {msg.card.suggestions.slice(0,2).map((sug: any) => (
                                  <div key={sug.id} onClick={() => handleAddContext(sug)} className="bg-surface-1 border border-[#E5EAF1] hover:border-neutral-400 hover:bg-neutral-100 rounded-xl p-3 cursor-pointer transition-all group relative">
                                    <h5 className="text-[13px] font-medium text-text-main mb-1 group-hover:text-neutral-950 flex items-center justify-between">
                                      {sug.title}
                                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 text-neutral-700 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </h5>
                                    <p className="text-[13px] text-text-secondary line-clamp-1">{sug.desc}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {/* isProcessing animation removed to avoid duplication with ThoughtsBlock */}
            </div>
            {/* Phantom bottom margin removed */}
          </div>

          {/* Unified Input Console */}
          <div className="shrink-0 pt-12 pb-4 px-10 bg-gradient-to-t from-[#f7f7f7] via-[#f7f7f7]/95 to-transparent relative z-20">
            <div className="max-w-4xl mx-auto relative">
              {/* The Input Container */}
              <div className="relative z-50">
                <AnimatePresence>
                  <AgentSelector
                    isOpen={isAgentSelectorOpen}
                    onClose={() => setIsAgentSelectorOpen(false)}
                    activeAgentId={activeAgentId}
                    onSelectAgent={setActiveAgentId}
                    onOpenMarket={() => setActiveNav("skills")}
                  />
                  {isCommandDirOpen && (
                    <CommandDirectory
                      onSelectCommand={(cmd) => {
                        setQuery(cmd);
                        setIsCommandDirOpen(false);
                      }}
                      isOpen={isCommandDirOpen}
                      onClose={() => setIsCommandDirOpen(false)}
                    />
                  )}
                </AnimatePresence>

                {(messages.length === 0 ||
                  (messages.length === 1 && messages[0].role === "agent")) && (
                  <>
                    {/* Shortcuts Bar */}
                    <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 hide-scrollbar px-2">
                      {selectedShortcut &&
                      selectedShortcut.contexts &&
                      selectedShortcut.contexts.length > 0
                        ? selectedShortcut.contexts.map((context: any) => (
                            <button
                              key={context.id}
                              onClick={() => {
                                setQuery(context.action);
                                if (textareaRef.current) {
                                  textareaRef.current.focus();
                                }
                              }}
                              className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-surface-1 border border-border-default shadow-sm text-text-secondary hover:text-neutral-950 hover:border-neutral-300 hover:bg-neutral-100 text-[13px] rounded-xl transition-all shrink-0"
                            >
                              <FileText
                                size={14}
                                className="text-text-tertiary"
                              />
                              {context.name}
                            </button>
                          ))
                        : QUICK_SHORTCUTS.map((shortcut) => (
                            <button
                              key={shortcut.id}
                              onClick={() => {
                                setSelectedShortcut(shortcut);
                                setQuery(""); // When clicking the blue tag, we just select the shortcut (add tag), and don't fill text yet
                                if (textareaRef.current) {
                                  textareaRef.current.focus();
                                }
                              }}
                              className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-hover-bg hover:bg-selected-bg text-text-secondary text-[13px] rounded-lg transition-colors shrink-0"
                            >
                              {shortcut.name}
                              <ArrowDownRight
                                size={14}
                                className="text-text-tertiary"
                              />
                            </button>
                          ))}
                    </div>
                  </>
                )}

                <div className="bg-surface-1 p-2 rounded-[24px] shadow-[0_4px_18px_rgba(0,0,0,0.06)] flex flex-col border border-neutral-300 focus-within:border-neutral-500 focus-within:ring-1 focus-within:ring-neutral-300 transition-all text-text-main relative">
                  
                  {/* Top: The input wrapper */}
                  <div className="flex-1 relative flex flex-col min-h-[48px] justify-center px-1 py-1">
                    {activeProjectId === 'project-b' && references.length > 0 && (
                      <div className="flex flex-wrap gap-2 px-3 pt-2 pb-1 bg-surface-1 max-h-[100px] overflow-y-auto">
                        {references.slice(0, 3).map((ref: any) => (
                          <div key={ref.id} className="group relative flex items-center gap-1.5 bg-transparent border border-[#E5EAF1] text-text-main pl-2 pr-1 py-1 rounded-md text-[13px] shadow-sm cursor-pointer hover:bg-[#F6F8FB] transition-colors">
                            {ref.type === 'folder' ? <Folder size={12} className="text-[#98A2B3]"/> : <File size={12} className="text-[#98A2B3]"/>}
                            <span>{ref.name}</span>
                            <button 
                              onClick={(ev) => {
                                 ev.stopPropagation();
                                 setReferences((prev: any) => prev.filter((r: any) => r.id !== ref.id));
                              }}
                              className="text-[#98A2B3] hover:text-text-main ml-1 p-0.5 hover:bg-[#E5EAF1] rounded transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        {references.length > 3 && (
                          <div className="flex items-center justify-center bg-transparent border border-[#E5EAF1] text-text-secondary px-2 py-1 rounded-md text-[13px] shadow-sm cursor-pointer">
                            +{references.length - 3}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedShortcut && (
                      <div className="flex mb-1 ml-2 mt-1">
                        <div className="flex items-center gap-1.5 bg-transparent text-text-main border border-[#E5EAF1] px-2.5 py-1 rounded-md text-[13px] shadow-sm shrink-0">
                          <PieChart size={14} className="text-[#98A2B3]" />
                          <span>{selectedShortcut.name}</span>
                          <button
                            onClick={() => {
                              setSelectedShortcut(null);
                              setQuery("");
                              if (textareaRef.current) {
                                textareaRef.current.style.height = "auto";
                              }
                            }}
                            className="text-[#98A2B3] hover:text-text-main ml-1 opacity-60 hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                    <SmartInput
                      ref={textareaRef}
                      id="chat-input"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleExecute();
                          if (activeProjectId === 'project-b') { setReferences((prev: any) => prev.filter((r: any) => r.pinned)); }
                          setSelectedShortcut(null);
                          if (textareaRef.current) {
                            textareaRef.current.style.height = "auto";
                          }
                        }
                      }}
                      placeholder={
                        query || selectedShortcut
                          ? ""
                          : `我们要做什么？`
                      }
                      className="bg-transparent border-none outline-none text-[16px] text-text-main w-full placeholder:text-text-tertiary placeholder:transition-opacity pl-2 resize-none overflow-y-auto"
                      rows={1}
                      style={{ minHeight: "24px", maxHeight: "300px" }}
                    />
                  </div>
                  
                  {/* Bottom: Action bar */}
                  <div className="flex items-center justify-between px-1 pb-1 mt-1">
                    <div className="flex items-center gap-1">
                      {/* Plus Button */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAttachMenuOpen(!isAttachMenuOpen);
                            setIsApprovalMenuOpen(false);
                            setIsModelMenuOpen(false);
                            setIsAgentSelectorOpen(false);
                            setIsCommandDirOpen(false);
                          }}
                          className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${isAttachMenuOpen ? "bg-neutral-100 text-neutral-900 rotate-45" : "text-[#98A2B3] hover:text-neutral-900 hover:bg-neutral-100"}`}
                          title="添加"
                          aria-label={isAttachMenuOpen ? "关闭添加菜单" : "添加"}
                        >
                          <Plus
                            size={20}
                            className="transition-transform duration-300"
                          />
                        </button>
                        <AnimatePresence>
                          {isAttachMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsAttachMenuOpen(false)}
                              />
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                                className="absolute left-0 bottom-full mb-2 w-[260px] bg-surface-1 border border-border-default shadow-xl rounded-2xl z-50 py-1.5 flex flex-col overflow-hidden"
                              >
                                <div className="px-1.5 py-1 flex flex-col">
                                  <div className="px-2 py-1.5 text-[12px] font-medium text-text-tertiary">添加</div>
                                  
                                  <button onClick={() => setIsAttachMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 hover:bg-page-bg rounded-lg text-text-secondary hover:text-text-main transition-colors text-[13px] text-left w-full group">
                                    <Paperclip size={15} className="text-text-tertiary shrink-0" />
                                    <span>文件和文件夹</span>
                                  </button>
                                  
                                  <button onClick={() => setIsAttachMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 hover:bg-page-bg rounded-lg text-text-secondary hover:text-text-main transition-colors text-[13px] text-left w-full group">
                                    <Folder size={15} className="text-text-tertiary shrink-0" />
                                    <div className="flex flex-col">
                                      <span className="font-medium text-text-main">在项目中工作</span>
                                      <span className="text-text-tertiary text-[12px]">在项目中开始聊天</span>
                                    </div>
                                  </button>

                                  <button onClick={() => setIsAttachMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 hover:bg-page-bg rounded-lg text-text-secondary hover:text-text-main transition-colors text-[13px] text-left w-full group">
                                    <Target size={15} className="text-text-tertiary shrink-0" />
                                    <div className="flex flex-col">
                                      <span className="font-medium text-text-main">目标</span>
                                      <span className="text-text-tertiary text-[12px]">设置要持续追求的目标</span>
                                    </div>
                                  </button>
                                  
                                  <button onClick={() => setIsAttachMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 hover:bg-page-bg rounded-lg bg-surface-subtle text-text-secondary hover:text-text-main transition-colors text-[13px] text-left w-full group mt-1">
                                    <Lightbulb size={15} className="text-text-tertiary shrink-0" />
                                    <div className="flex flex-col">
                                      <span className="font-medium text-text-main">计划模式</span>
                                      <span className="text-text-tertiary text-[12px]">开启计划模式</span>
                                    </div>
                                  </button>

                                  <div className="mt-3 px-2 py-1 text-[12px] font-medium text-text-tertiary">插件</div>
                                  
                                  <button onClick={() => setIsAttachMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 hover:bg-page-bg rounded-lg text-text-secondary hover:text-text-main transition-colors text-[13px] text-left w-full group">
                                    <Triangle size={15} className="text-text-tertiary shrink-0 fill-current" />
                                    <div className="flex flex-col overflow-hidden">
                                      <span className="font-medium text-text-main">Vercel</span>
                                      <span className="text-text-tertiary text-[12px] truncate">Build and deploy web apps and agents</span>
                                    </div>
                                  </button>
                                  
                                  <button onClick={() => setIsAttachMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 hover:bg-page-bg rounded-lg text-text-secondary hover:text-text-main transition-colors text-[13px] text-left w-full group">
                                    <Github size={15} className="text-text-tertiary shrink-0" />
                                    <div className="flex flex-col overflow-hidden">
                                      <span className="font-medium text-text-main">GitHub</span>
                                      <span className="text-text-tertiary text-[12px] truncate">Triage PRs, issues, CI, and publish flows</span>
                                    </div>
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Approval Dropdown Wrapper */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setIsApprovalMenuOpen(!isApprovalMenuOpen);
                            setIsAttachMenuOpen(false);
                            setIsModelMenuOpen(false);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-subtle hover:bg-hover-bg text-text-secondary hover:text-text-main text-[13px] font-medium transition-colors"
                        >
                          {approvalMode === 'request' ? <Hand size={14} /> : <Terminal size={14} />}
                          {approvalMode === 'request' ? '请求批准' : '帮我批准'}
                        </button>

                        <AnimatePresence>
                          {isApprovalMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsApprovalMenuOpen(false)}
                              />
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                                className="absolute left-0 bottom-full mb-2 w-[340px] bg-surface-1 border border-border-default shadow-xl rounded-2xl z-50 py-2 flex flex-col overflow-hidden"
                              >
                                <div className="px-4 py-2 flex items-center justify-between mb-1">
                                  <span className="text-[13px] text-text-secondary">应如何批准 AI 操作？</span>
                                  <a href="#" className="text-[13px] text-text-tertiary hover:text-text-secondary underline underline-offset-2">了解更多</a>
                                </div>
                                <div className="px-2 py-1">
                                  <button
                                    onClick={() => {
                                      setApprovalMode('request');
                                      setIsApprovalMenuOpen(false);
                                    }}
                                    className="flex items-start justify-between w-full px-3 py-2.5 rounded-xl hover:bg-page-bg group transition-colors text-left"
                                  >
                                    <div className="flex items-start gap-3">
                                      <Hand size={16} className="text-text-secondary shrink-0 mt-0.5" />
                                      <div>
                                        <div className="text-[14px] text-text-main font-medium mb-0.5">请求批准</div>
                                        <div className="text-[12px] text-text-tertiary leading-tight">编辑外部文件和使用互联网时始终询问</div>
                                      </div>
                                    </div>
                                    {approvalMode === 'request' && <Check size={16} className="text-text-main shrink-0 mt-1" />}
                                  </button>

                                  <button
                                    onClick={() => {
                                      setApprovalMode('auto');
                                      setIsApprovalMenuOpen(false);
                                    }}
                                    className="flex items-start justify-between w-full px-3 py-2.5 rounded-xl hover:bg-page-bg group transition-colors text-left"
                                  >
                                    <div className="flex items-start gap-3">
                                      <Terminal size={16} className="text-text-secondary shrink-0 mt-0.5" />
                                      <div>
                                        <div className="text-[14px] text-text-main font-medium mb-0.5">帮我批准</div>
                                        <div className="text-[12px] text-text-tertiary leading-tight">仅对检测到的风险操作请求批准</div>
                                      </div>
                                    </div>
                                    {approvalMode === 'auto' && <Check size={16} className="text-text-main shrink-0 mt-1" />}
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Model Selection */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setIsModelMenuOpen(!isModelMenuOpen);
                            setIsAttachMenuOpen(false);
                            setIsApprovalMenuOpen(false);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-surface-subtle text-text-secondary hover:text-text-main text-[13px] font-medium transition-colors"
                        >
                          <Zap size={14} className={selectedModel === 'extreme' ? 'text-amber-500' : 'text-text-secondary'} />
                          {selectedModel === 'fast' ? '快速' : '极致'}
                          <ChevronDown size={14} className="opacity-60 ml-0.5" />
                        </button>
                        
                        <AnimatePresence>
                          {isModelMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsModelMenuOpen(false)}
                              />
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                                className="absolute right-0 bottom-full mb-2 w-[240px] bg-surface-1 border border-border-default shadow-xl rounded-2xl z-50 p-2 flex flex-col"
                              >
                                <button
                                  onClick={() => {
                                    setSelectedModel('fast');
                                    setIsModelMenuOpen(false);
                                  }}
                                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-page-bg group transition-colors text-left"
                                >
                                  <div className="flex flex-col">
                                    <span className="text-[14px] text-text-main font-medium">快速</span>
                                    <span className="text-[12px] text-text-tertiary">1倍消耗，适合日常任务</span>
                                  </div>
                                  {selectedModel === 'fast' && <Check size={16} className="text-text-main shrink-0" />}
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedModel('extreme');
                                    setIsModelMenuOpen(false);
                                  }}
                                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-page-bg group transition-colors text-left mt-1"
                                >
                                  <div className="flex flex-col">
                                    <span className="text-[14px] text-text-main font-medium flex items-center gap-1.5">极致 <Zap size={12} className="text-amber-500 fill-current"/></span>
                                    <span className="text-[12px] text-text-tertiary">2倍消耗，深思熟虑推理</span>
                                  </div>
                                  {selectedModel === 'extreme' && <Check size={16} className="text-text-main shrink-0" />}
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full text-text-tertiary hover:text-text-main hover:bg-surface-subtle transition-colors">
                        <Mic size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (isProcessing) {
                            setIsProcessing(false);
                            setMessages((prev: any) => prev.map((m: any) => {
                              if (m.role === 'agent' && (m.isThinking || (m.card && m.card.type === 'progress'))) {
                                return {
                                  ...m,
                                  isThinking: false,
                                  content: '任务已取消。',
                                  isCancelled: true,
                                  card: undefined
                                };
                              }
                              return m;
                            }));
                          } else {
                            handleExecute();
                            if (activeProjectId === 'project-b') { setReferences((prev: any) => prev.filter((r: any) => r.pinned)); }
                          }
                        }}
                        className={`w-9 h-9 ml-1 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-sm shrink-0 cursor-pointer ${query || isProcessing ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                        aria-label={isProcessing ? "停止当前任务" : "发送消息"}
                      >
                        {isProcessing ? (
                          <div className="w-2.5 h-2.5 bg-surface-1 rounded-sm" />
                        ) : (
                          <ArrowUp size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === Bottom Agent Workflow Bar === */}
          {isProcessing && (
            <>

          {bottomExpanded && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setBottomExpanded(false)}
            />
          )}
          <div className="shrink-0 border-t border-border-default bg-surface-1 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] relative z-50">
            <AnimatePresence>
              {bottomExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute bottom-[calc(100%+12px)] right-6 w-[400px] bg-surface-1 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.08)] border border-border-default flex flex-col overflow-hidden origin-bottom-right z-50 mb-2"
                >
                  <div className="flex items-center justify-between py-5 px-6 border-b border-neutral-50 bg-[#fafafa]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-neutral-950 text-white rounded-[10px] flex items-center justify-center shadow-sm">
                        <Network size={14} />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-semibold text-text-main tracking-tight">
                          全自动编排列
                        </h3>
                        <div className="text-[13px] text-text-tertiary mt-0.5 tracking-wide">
                          任务执行链路
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setBottomExpanded(false)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-selected-bg bg-hover-bg rounded-full text-text-tertiary transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[360px] px-5 py-4 bg-surface-1 custom-scrollbar">
                    {[
                      {
                        stage: "策略探测",
                        status: "完成",
                        detail:
                          "分析近期大盘数据发现蓝海词「低卡茶饮」，热度上升 42%",
                        time: "10:42",
                        id: "step-1",
                      },
                      {
                        stage: "批量内容生成",
                        status: "执行中",
                        detail: "正在根据策略矩阵生成笔记，已完成 12/25 篇",
                        active: true,
                        time: "10:45",
                        id: "step-2",
                      },
                      {
                        stage: "分发排期",
                        status: "排队中",
                        detail: "等待内容生成完毕后，将自动下发至各渠道排期",
                        time: "--:--",
                        id: "step-3",
                      },
                      {
                        stage: "数据归因",
                        status: "待触发",
                        detail: "等待发布后回流数据报表并优化策略",
                        time: "--:--",
                        id: "step-4",
                      },
                    ].map((step, i, arr) => (
                      <div
                        key={step.id}
                        className="relative flex gap-3 pb-4 last:pb-0 group"
                      >
                        {i < arr.length - 1 && (
                          <div className="absolute left-[7px] top-4 bottom-0 w-[1px]">
                            <div
                              className={`w-full h-full ${step.status === "完成" ? "bg-neutral-700" : "bg-hover-bg border-l-[1px] border-dashed border-border-default"}`}
                            />
                          </div>
                        )}

                        <div className="mt-1 w-[15px] flex justify-center shrink-0 relative z-10">
                          <div
                            className={`w-3 h-3 rounded-full flex items-center justify-center ${step.active ? "bg-neutral-950 shadow-[0_0_0_3px_rgba(0,0,0,0.08)]" : step.status === "完成" ? "bg-neutral-700 border border-neutral-700" : "bg-surface-1 border-2 border-border-default"}`}
                          >
                            {step.active && (
                              <div className="w-1.5 h-1.5 bg-surface-1 rounded-full animate-pulse" />
                            )}
                          </div>
                        </div>

                        <div
                          className={`flex-1 pt-0 ${step.active ? "opacity-100" : step.status === "完成" ? "opacity-90" : "opacity-50"}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[13px] ${step.active ? "text-neutral-950" : "text-text-main"}`}
                              >
                                {step.stage}
                              </span>
                              <span
                                className={`text-[13px] px-1.5 py-0.5 rounded-sm ${step.active ? "bg-neutral-100 text-neutral-800" : step.status === "完成" ? "bg-hover-bg text-text-secondary" : "hidden"}`}
                              >
                                {step.status}
                              </span>
                            </div>
                            <span className="text-[13px] text-text-tertiary font-mono tracking-tight">
                              {step.time}
                            </span>
                          </div>
                          <p className="text-[13px] font-medium text-text-tertiary mt-1 leading-snug break-all line-clamp-2">
                            {step.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className={`h-[46px] flex items-center justify-between px-6 cursor-pointer hover:bg-neutral-50 transition-colors group ${bottomExpanded ? "bg-neutral-50 border-t-neutral-300 border-t" : ""}`}
              onClick={() => setBottomExpanded(!bottomExpanded)}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-[13px] ">
                  <div className="w-2 h-2 rounded-full bg-neutral-700 animate-pulse" />
                  AI 正在运行
                </div>
                <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                  <span className="text-text-tertiary ">当前节点:</span>{" "}
                  批量内容分发与素材组织中...
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-text-tertiary group-hover:text-neutral-900 transition-colors">
                  {bottomExpanded ? "收起工作流" : "展开工作流详细"}
                </span>
                {bottomExpanded ? (
                  <PanelRightClose
                    size={16}
                    className="text-neutral-700 rotate-90 transition-colors"
                  />
                ) : (
                  <PanelLeftOpen
                    size={16}
                    className="text-text-tertiary group-hover:text-neutral-900 -rotate-90 transition-colors"
                  />
                )}
              </div>
            </div>
          </div>
            </>
          )}
        </div>

        {/* RIGHT PANEL: 智能 Escort Engine or Brand Profile */}
        {isNewMerchant ? (
          <div className="w-[300px] 2xl:w-[340px] border-l border-border-default bg-[#fbfbfb] flex flex-col shrink-0 relative z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="p-4 border-b border-border-default flex items-center gap-2 bg-surface-1 shrink-0">
              <Sparkles size={18} className="text-brand-logo" />
              <span className="text-[14px] text-text-main">品牌心智扫描</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <ProfileSlot
                label="品牌调性"
                value={onboardingData.brand}
                icon={Compass}
                active={onboardingStep >= 0}
                flashed={onboardingStep === 0}
              />
              <ProfileSlot
                label="主打产品"
                value={onboardingData.product}
                icon={Target}
                active={onboardingStep >= 0}
                flashed={onboardingStep === 0}
              />
              <ProfileSlot
                label="目标受众"
                value={onboardingData.audience}
                icon={Users}
                active={onboardingStep >= 1}
                flashed={onboardingStep === 1}
              />
              <ProfileSlot
                label="防坑雷区"
                value={onboardingData.traps}
                icon={ShieldAlert}
                active={onboardingStep >= 3}
                flashed={onboardingStep === 3}
              />
              <ProfileSlot
                label="品牌声调"
                value={onboardingData.tone}
                icon={MessageSquare}
                active={onboardingStep >= 3}
                flashed={onboardingStep === 3}
              />
            </div>
          </div>
        ) : null}
        </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-surface-1 text-text-tertiary">
            <File size={48} className="mb-4 text-neutral-200" />
            <p className="text-[14px]">
              {openedTabs.find(t => t.id === activeTabId)?.name || '未找到文件'}
            </p>
            <p className="text-[13px] mt-2">（文件预览区域，可接入外部编辑器或表格组件）</p>
          </div>
        )}
      </div>
    </div>
  );
};
