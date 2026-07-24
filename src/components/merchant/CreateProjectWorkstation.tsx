import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Calendar, Users, FileText, Check, X, Target,
  AlertTriangle, Trash2, Edit2, Play, Bot, User, ArrowRight
} from "lucide-react";

export interface CreateProjectWorkstationProps {
  onClose: () => void;
  onCreate: (projectData: any) => void;
}

export function CreateProjectWorkstation({ onClose, onCreate }: CreateProjectWorkstationProps) {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: '你好，你想做什么项目？可以直接告诉我目标或资源情况。', type: 'text' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [projectData, setProjectData] = useState({
    name: "新营销项目",
    goal: "尚未明确",
    prepStart: new Date().toISOString().split('T')[0],
    reviewDate: new Date(Date.now() + 86400000*3).toISOString().split('T')[0],
    totalPosts: 0,
    budget: 0,
    accounts: [] as any[],
    missingItems: [] as any[],
    strategyBasis: "",
    initialContent: [] as any[]
  });

  const [hasData, setHasData] = useState(false);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    
    setChatHistory(prev => [...prev, { role: 'user', content: chatInput, type: 'text' }]);
    setChatInput("");
    setIsGenerating(true);

    setTimeout(() => {
      setHasData(true);
      setProjectData({
        name: "幼犬换粮搜索卡位",
        goal: "针对搜索流量，铺设高质量真实评测内容",
        prepStart: new Date().toISOString().split('T')[0],
        reviewDate: new Date(Date.now() + 86400000*3).toISOString().split('T')[0],
        totalPosts: 4,
        budget: 1000,
        accounts: [
          { id: 1, type: "店长号", name: "店长号A", posts: 2, method: "主设备直接发布", publisher: "张三" },
          { id: 2, type: "KOC", name: "待认领", posts: 2, method: "代发", publisher: "李四" }
        ],
        missingItems: [
          { id: 'm1', text: '确认手机发布人', resolved: false },
          { id: 'm2', text: '1组真实换粮素材', resolved: false }
        ],
        strategyBasis: "依据竞品词包数据，当前【幼犬换粮】搜索结果页竞争压力小，适合用KOC与自营号矩阵组合抢位。",
        initialContent: [
          { id: 'c1', title: '为什么幼犬换粮容易拉肚子？', type: '图文' },
          { id: 'c2', title: '我家金毛3个月换粮实录', type: '图文' }
        ]
      });
      setChatHistory(prev => [
        ...prev, 
        { role: 'ai', content: '已根据你的要求生成了初步的项目排期与分配方案。你可以在右侧直接修改，或告诉我需要调整哪里。', type: 'text' }
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCreate = () => {
    onCreate({
      id: `new-${Date.now()}`,
      name: projectData.name,
      status: "筹备",
      target: projectData.goal,
      period: `${projectData.prepStart} - ${projectData.reviewDate}`,
      aiJudgment: "项目已进入筹备，请优先处理缺失项。",
      recentChanges: []
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-neutral-100 overflow-hidden text-neutral-900">
      {/* Header */}
      <div className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors">
            <X size={20} />
          </button>
          <div className="font-bold text-[16px]">新建项目工作台</div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleCreate} disabled={!hasData} className="bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 disabled:text-neutral-500 text-white px-6 py-2.5 rounded-lg text-[14px] font-bold shadow-sm transition-all flex items-center gap-2">
            确认并创建 <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: AI Co-pilot Chat */}
        <div className="w-[400px] bg-white border-r border-neutral-200 flex flex-col shrink-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-neutral-900 text-white' : 'bg-primary-100 text-primary-600'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-4 rounded-2xl max-w-[80%] text-[14px] leading-relaxed ${msg.role === 'user' ? 'bg-neutral-900 text-white rounded-tr-sm' : 'bg-neutral-100 text-neutral-800 rounded-tl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
                <div className="p-4 rounded-2xl bg-neutral-100 text-neutral-800 rounded-tl-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-neutral-100 bg-neutral-50 shrink-0">
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all shadow-sm">
              <textarea
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
                placeholder="描述项目意图、目标或资源..."
                className="w-full h-20 p-3 resize-none outline-none text-[14px]"
              />
              <div className="p-2 flex justify-end border-t border-neutral-100 bg-neutral-50/50">
                <button 
                  onClick={handleSendChat}
                  disabled={!chatInput.trim() || isGenerating}
                  className="bg-primary-600 disabled:bg-neutral-200 hover:bg-primary-700 text-white p-2 rounded-lg transition-colors"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Canvas */}
        <div className="flex-1 overflow-y-auto bg-[#fcfcfc] p-8">
          {!hasData ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                <Sparkles size={32} className="text-neutral-300" />
              </div>
              <h2 className="text-[20px] font-bold text-neutral-900 mb-2">画布已准备就绪</h2>
              <p className="text-[14px] text-center max-w-md">
                在左侧告诉 AI 你的意图，这里将实时生成并展示项目的完整架构，你可以随时进行手工微调。
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <h1 className="text-[24px] font-extrabold text-neutral-900 mb-2">
                  <input 
                    value={projectData.name} 
                    onChange={e => setProjectData({...projectData, name: e.target.value})}
                    className="w-full bg-transparent outline-none hover:bg-neutral-50 focus:bg-neutral-50 px-2 py-1 -ml-2 rounded"
                  />
                </h1>
                <p className="text-[15px] text-neutral-500 flex items-center">
                  <Target size={16} className="mr-2" />
                  <input 
                    value={projectData.goal} 
                    onChange={e => setProjectData({...projectData, goal: e.target.value})}
                    className="flex-1 bg-transparent outline-none hover:bg-neutral-50 focus:bg-neutral-50 px-2 py-1 -ml-2 rounded"
                  />
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                  <h3 className="text-[14px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <Calendar size={16} className="text-neutral-400" /> 排期与预算
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] text-neutral-500">筹备开始</span>
                      <input type="date" value={projectData.prepStart} onChange={e => setProjectData({...projectData, prepStart: e.target.value})} className="text-[14px] font-bold outline-none border border-neutral-200 rounded px-2 py-1" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] text-neutral-500">初审目标日</span>
                      <input type="date" value={projectData.reviewDate} onChange={e => setProjectData({...projectData, reviewDate: e.target.value})} className="text-[14px] font-bold outline-none border border-neutral-200 rounded px-2 py-1" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] text-neutral-500">预算 (¥)</span>
                      <input type="number" value={projectData.budget} onChange={e => setProjectData({...projectData, budget: Number(e.target.value)})} className="text-[14px] font-bold outline-none border border-neutral-200 rounded px-2 py-1 w-24 text-right" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                  <h3 className="text-[14px] font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-400" /> 开工缺失项
                  </h3>
                  <div className="space-y-2">
                    {projectData.missingItems.map(item => (
                      <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border ${item.resolved ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                        <button 
                          onClick={() => setProjectData(prev => ({...prev, missingItems: prev.missingItems.map(i => i.id === item.id ? {...i, resolved: !i.resolved} : i)}))}
                          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${item.resolved ? 'bg-emerald-500 text-white' : 'border border-red-300'}`}
                        >
                          {item.resolved && <Check size={14} />}
                        </button>
                        <span className={`text-[13px] font-bold ${item.resolved ? 'text-emerald-700 line-through' : 'text-red-900'}`}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
                    <Users size={16} className="text-neutral-400" /> 账号分配 (共 {projectData.totalPosts} 篇)
                  </h3>
                  <button className="text-[12px] font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors">
                    + 添加账号
                  </button>
                </div>
                <div className="space-y-2">
                  {projectData.accounts.map(acc => (
                    <div key={acc.id} className="grid grid-cols-4 gap-4 items-center bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                      <div>
                        <div className="text-[11px] text-neutral-500 mb-1">账号</div>
                        <input value={acc.name} onChange={e => setProjectData(prev => ({...prev, accounts: prev.accounts.map(a => a.id === acc.id ? {...a, name: e.target.value} : a)}))} className="w-full text-[13px] font-bold bg-transparent outline-none border-b border-transparent focus:border-neutral-300" />
                      </div>
                      <div>
                        <div className="text-[11px] text-neutral-500 mb-1">类型</div>
                        <select value={acc.type} onChange={e => setProjectData(prev => ({...prev, accounts: prev.accounts.map(a => a.id === acc.id ? {...a, type: e.target.value} : a)}))} className="w-full text-[13px] font-bold bg-transparent outline-none cursor-pointer">
                          <option>店长号</option>
                          <option>KOC</option>
                          <option>蓝V</option>
                        </select>
                      </div>
                      <div>
                        <div className="text-[11px] text-neutral-500 mb-1">发文量</div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setProjectData(prev => ({...prev, accounts: prev.accounts.map(a => a.id === acc.id ? {...a, posts: Math.max(0, a.posts - 1)} : a)}))} className="w-6 h-6 rounded bg-white border border-neutral-200 flex items-center justify-center">-</button>
                          <span className="text-[13px] font-bold w-4 text-center">{acc.posts}</span>
                          <button onClick={() => setProjectData(prev => ({...prev, accounts: prev.accounts.map(a => a.id === acc.id ? {...a, posts: a.posts + 1} : a)}))} className="w-6 h-6 rounded bg-white border border-neutral-200 flex items-center justify-center">+</button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-[11px] text-neutral-500 mb-1">负责人</div>
                          <input value={acc.publisher} onChange={e => setProjectData(prev => ({...prev, accounts: prev.accounts.map(a => a.id === acc.id ? {...a, publisher: e.target.value} : a)}))} className="w-full text-[13px] font-bold bg-transparent outline-none border-b border-transparent focus:border-neutral-300" />
                        </div>
                        <button className="text-neutral-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
