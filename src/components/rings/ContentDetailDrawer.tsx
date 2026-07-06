import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, CheckCircle2, Bot, ChevronRight, Wand2, FileText, 
  Image as ImageIcon, Compass, Send, CheckCircle, Clock,
  MessageSquare, User, Smartphone, Users, Link, Bell, CheckSquare, Edit3
} from 'lucide-react';

const GROUPS = [
  { id: 'official', name: '专业号', countStr: '3 篇待确认', action1: '一键确认并通知账号', action2: '获取分发链接', color: 'bg-blue-500' },
  { id: 'kos', name: '员工号', countStr: '4 篇待确认', action1: '一键确认并通知员工', action2: '获取分发链接', color: 'bg-indigo-500' },
  { id: 'koc_general', name: 'KOC矩阵', countStr: '8 篇待确认', action1: '一键确认并上架任务', action2: '生成任务码', color: 'bg-emerald-500' },
  { id: 'koc_real', name: '客户号', countStr: '30 个快发额度', action1: '生成门店快发入口', action2: '', color: 'bg-amber-500' },
];

const MOCK_CONTENT = [
  {
    id: 'c1',
    channel: 'official',
    channelName: '专业号',
    title: '幼犬软便怎么办？这3个换粮误区你中招了吗？',
    status: '待确认',
    strategy: '专业科普',
    memory: '品牌背书、7日换粮法、无谷配方',
    materials: '官方产品海报、成分拆解图',
    readyForPublish: true,
    content: '作为一名从医5年的宠物医生，接诊过太多因为换粮不当导致肠胃炎的幼犬。今天就来科普一下正确的换粮姿势。\n\n误区一：一次性全部换新粮。幼犬肠胃脆弱，需要7天过渡期（俗称7日换粮法）。\n\n误区二：只看包装不看成分。一定要学会看配料表，首选鲜肉配方，避开肉粉和诱食剂。\n\n选粮建议：推荐肠胃敏感的幼犬选择含有益生菌、无谷低敏配方的狗粮。最近测评的一款国产粮，鲜肉含量高达70%，且添加了枯草芽孢杆菌，对幼犬肠胃非常友好。',
    tags: '#宠物科普 #狗狗软便 #健康养宠'
  },
  {
    id: 'c2',
    channel: 'kos',
    channelName: '员工号',
    title: '店长手记：今天接诊了一只挑食小金毛',
    status: '待确认',
    strategy: '服务记录',
    memory: '线下门店场景、真实服务案例',
    materials: '店面问答实拍图',
    readyForPublish: true,
    content: '今天遇到个特别发愁的客户，说他家金毛挑食得不行。我拿了几个试吃装给金毛，结果它对这款无谷低敏粮情有独钟...\n\n建议家里有挑食修勾的铲屎官，可以试试多换几种口味。',
    tags: '#宠物店日常 #金毛 #挑食狗狗'
  },
  {
    id: 'c4',
    channel: 'koc_general',
    channelName: 'KOC矩阵',
    title: '大学生穷养狗平价好物',
    status: '待确认',
    strategy: '素人种草',
    memory: '大学生、宿舍养宠、平价好物、低营销感',
    materials: '通用生活场景图',
    readyForPublish: true,
    content: '宿舍养狗真的太费钱了！每个月生活费本来就不多，还要给主子买狗粮。做了好多功课才选了这款国产粮，均价才十几块一斤，但是配料表第一位是鲜肉，对于学生党来说真的性价比拉满了。\n\n狗狗吃了快一个月，粑粑正常，毛发也亮亮的，感觉挖到宝了！',
    tags: '#学生党 #平价好物 #养狗日常'
  },
  {
    id: 'c3',
    channel: 'koc_real',
    channelName: '客户号',
    title: '门店快发体验码 (池内 30 个名额)',
    status: '待分配入口',
    strategy: '客户即时生成',
    memory: '扫码后收集：身份标签、体验场景、关注点、一句话感受',
    materials: '客户现场实拍',
    readyForPublish: false,
    isBrief: true,
    briefDesc: '此通道为客户专属快发入口，内容将在客户扫码并上传基本信息后即时生成。',
    briefTasks: [
      '门店生成专属体验码，提供给到店/购买客户',
      '客户扫码，上传 1 张现场实拍图',
      '客户勾选体验场景（如：首次进店 / 换粮体验）',
      '客户输入一句真实感受（如：店员讲解很细致，狗狗很喜欢吃）',
      'AI 接收输入，3秒生成专属体验笔记，客户确认后一键发布'
    ],
    icon: <Smartphone size={16} />
  }
];

export const ContentDetailDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [items, setItems] = useState(MOCK_CONTENT);
  const [selectedContent, setSelectedContent] = useState<typeof MOCK_CONTENT[0] | null>(null);
  
  // Tabs state
  const [activeTab, setActiveTab] = useState<string>('official');

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [showLearningToast, setShowLearningToast] = useState(false);
  
  // AI Rewrite state
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiRewriting, setIsAiRewriting] = useState(false);
  const [selectedTextContext, setSelectedTextContext] = useState<{ text: string, start: number, end: number } | null>(null);
  
  const [batchLoadingGroup, setBatchLoadingGroup] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleBatchConfirm = (groupId: string) => {
    setBatchLoadingGroup(groupId);
    setTimeout(() => {
      setBatchLoadingGroup(null);
      setItems(items.map(item => item.channel === groupId ? { ...item, status: '已下发' } : item));
    }, 1500);
  };

  const handleTextSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    if (start !== end) {
      const text = target.value.substring(start, end);
      setSelectedTextContext({ text, start, end });
    }
  };

  const executeAiRewrite = () => {
    if (!aiPrompt) return;
    setIsAiRewriting(true);
    setTimeout(() => {
      setIsAiRewriting(false);
      
      if (selectedTextContext) {
        // Rewrite only the selected portion
        const before = editContent.substring(0, selectedTextContext.start);
        const after = editContent.substring(selectedTextContext.end);
        const newText = `【${selectedTextContext.text} -> AI已按要求("${aiPrompt}")修改】`;
        setEditContent(before + newText + after);
        setSelectedTextContext(null); // Clear selection after use
      } else {
        // Full rewrite
        setEditContent(editContent + "\n\n[AI已根据您的要求润色，语气更口语化]");
      }
      setAiPrompt("");
    }, 1500);
  };

  // Filter items by active tab
  const groupItems = items.filter(i => i.channel === activeTab);
  const activeGroupDef = GROUPS.find(g => g.id === activeTab);
  const allDone = groupItems.length > 0 && groupItems.every(i => i.status === '已下发');

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-[1000px] bg-neutral-50 h-full shadow-2xl flex flex-col relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-16 border-b border-neutral-200 flex items-center justify-between px-6 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-[18px] text-neutral-900">批量快审与分发控制台</h3>
            {showLearningToast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-[12px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full shadow-sm"
              >
                <Bot size={14} /> AI 已记录您的修改偏好，将用于迭代后续人设引擎
              </motion.div>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧列表 */}
          <div className="w-[360px] bg-white border-r border-neutral-200 flex flex-col h-full overflow-hidden shrink-0">
            {/* Top Tabs */}
            <div className="flex border-b border-neutral-200 bg-neutral-50/50">
              {GROUPS.map(g => (
                <button
                  key={g.id}
                  onClick={() => setActiveTab(g.id)}
                  className={`flex-1 py-3 text-[13px] font-bold relative transition-colors ${
                    activeTab === g.id ? 'text-indigo-600 bg-white' : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100/50'
                  }`}
                >
                  {g.name}
                  {activeTab === g.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                  )}
                </button>
              ))}
            </div>

            {/* Batch Controls for active tab */}
            {activeGroupDef && (
              <div className="p-4 border-b border-neutral-100">
                <div className="flex flex-col gap-2 bg-white border border-neutral-200 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[13px] font-bold text-neutral-900 flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${activeGroupDef.color}`} />
                        {activeGroupDef.name} 队列
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {activeGroupDef.id === 'koc_real' ? activeGroupDef.countStr : (allDone ? '已全部分发' : activeGroupDef.countStr)}
                      </div>
                    </div>
                    {activeGroupDef.id === 'koc_real' ? (
                      <button className="text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1.5 rounded flex items-center gap-1 transition-colors">
                        <Smartphone size={12} />
                        {activeGroupDef.action1}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleBatchConfirm(activeGroupDef.id)}
                        disabled={allDone || batchLoadingGroup === activeGroupDef.id}
                        className={`text-[11px] font-bold px-2 py-1.5 rounded flex items-center gap-1 transition-colors ${
                          allDone ? 'bg-emerald-50 text-emerald-600' : 'text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50'
                        }`}
                      >
                        {batchLoadingGroup === activeGroupDef.id ? (
                           <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        ) : allDone ? (
                          <><CheckCircle size={12} /> 已完成下发</>
                        ) : (
                          <><Bell size={12} /> {activeGroupDef.action1}</>
                        )}
                      </button>
                    )}
                  </div>
                  {activeGroupDef.action2 && !allDone && (
                    <div className="flex justify-end mt-1">
                      <button className="text-[11px] font-medium text-neutral-500 hover:text-neutral-700 flex items-center gap-1">
                        <Link size={12} /> {activeGroupDef.action2}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-neutral-50/30">
              <div className="text-[12px] font-bold text-neutral-400 px-1 pt-2">详情预览</div>
              {groupItems.map(item => (
                <div 
                  key={item.id}
                  onClick={() => {
                    setSelectedContent(item);
                    setIsEditing(false);
                    setSelectedTextContext(null);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedContent?.id === item.id 
                      ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                      : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                      item.channel === 'official' ? 'bg-blue-50 text-blue-700' :
                      item.channel === 'kos' ? 'bg-indigo-50 text-indigo-700' :
                      item.channel === 'koc_real' ? 'bg-amber-50 text-amber-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      {item.channel === 'koc_real' || item.channel === 'koc_general' ? <Users size={12} /> : <User size={12} />}
                      {item.channelName}
                    </span>
                    <span className={`text-[11px] font-medium ${item.status === '已下发' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-[13px] font-bold text-neutral-900 leading-tight mb-2 line-clamp-2">{item.title}</h4>
                </div>
              ))}
              {groupItems.length === 0 && (
                <div className="text-center p-6 text-neutral-400 text-[13px]">
                  无待处理内容
                </div>
              )}
            </div>
          </div>

          {/* 右侧详情 */}
          <div className="flex-1 bg-neutral-50 overflow-y-auto relative p-6">
            {selectedContent ? (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200/60">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      {isEditing ? null : <h2 className="text-[18px] font-bold text-neutral-900 mb-2">{selectedContent.title}</h2>}
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md">{selectedContent.strategy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                      <div className="flex items-center gap-1.5 text-neutral-500 mb-2">
                        <Wand2 size={14} />
                        <span className="text-[12px] font-bold">关联条件记忆</span>
                      </div>
                      <p className="text-[13px] text-neutral-800 leading-relaxed font-medium">
                        {selectedContent.memory}
                      </p>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                      <div className="flex items-center gap-1.5 text-neutral-500 mb-2">
                        <ImageIcon size={14} />
                        <span className="text-[12px] font-bold">匹配素材库</span>
                      </div>
                      <p className="text-[13px] text-neutral-800 leading-relaxed font-medium">
                        {selectedContent.materials}
                      </p>
                    </div>
                  </div>

                  {selectedContent.isBrief ? (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/50 rounded-xl p-5 shadow-sm">
                      <div className="flex items-center gap-2 text-[14px] font-bold text-amber-900 mb-3">
                       {selectedContent.icon || <Clock size={16} />} 
                       {selectedContent.channel === 'koc_real' ? '门店体验码分发逻辑' : '泛素人分发逻辑'}
                      </div>
                      <p className="text-[13px] text-amber-800/80 leading-relaxed mb-4">{selectedContent.briefDesc}</p>
                      
                      <div className="space-y-2 bg-white rounded-lg p-3 border border-amber-100/50">
                        <div className="text-[12px] font-bold text-neutral-700 mb-2">分发与执行路径：</div>
                        {selectedContent.briefTasks?.map((task, i) => (
                          <div key={i} className="flex items-start gap-2 text-[13px] text-neutral-600">
                            <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                            {task}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-[14px] font-bold text-neutral-900">正文预览</div>
                        {selectedContent.readyForPublish && !isEditing && (
                          <button 
                            className="text-[12px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                            onClick={() => {
                              setIsEditing(true);
                              setEditTitle(selectedContent.title);
                              setEditContent(selectedContent.content);
                              setEditTags(selectedContent.tags || "");
                              setSelectedTextContext(null);
                            }}
                          >
                            <Edit3 size={14} /> 编辑
                          </button>
                        )}
                        {isEditing && (
                          <button 
                            className="text-[12px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm"
                            onClick={() => {
                              setIsEditing(false);
                              const updated = {...selectedContent, title: editTitle, content: editContent, tags: editTags, status: '已单篇确认'};
                              setSelectedContent(updated);
                              setItems(items.map(i => i.id === updated.id ? updated : i));
                              setShowLearningToast(true);
                              setTimeout(() => setShowLearningToast(false), 3000);
                            }}
                          >
                            <CheckSquare size={14} /> 保存修改并确认
                          </button>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[12px] font-bold text-neutral-500 mb-1">标题</label>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-[14px] font-bold text-neutral-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[12px] font-bold text-neutral-500">正文</label>
                              <span className="text-[11px] text-neutral-400">可选中文字进行局部 AI 修改</span>
                            </div>
                            <textarea
                              ref={textareaRef}
                              value={editContent}
                              onSelect={handleTextSelect}
                              onMouseUp={handleTextSelect}
                              onKeyUp={handleTextSelect}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full h-40 bg-white border border-neutral-200 rounded-xl p-4 text-[13px] text-neutral-700 leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none shadow-inner"
                            />
                          </div>
                          <div>
                            <label className="block text-[12px] font-bold text-neutral-500 mb-1">话题标签</label>
                            <input
                              type="text"
                              value={editTags}
                              onChange={(e) => setEditTags(e.target.value)}
                              className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-[13px] text-indigo-600 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
                            />
                          </div>
                          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex flex-col gap-3 transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Bot size={16} className="text-indigo-600" />
                                <span className="text-[13px] font-bold text-indigo-900">AI 辅助修改与自学习</span>
                              </div>
                              <span className="text-[11px] text-indigo-600/70 bg-indigo-100/50 px-2 py-0.5 rounded">您的修改将自动被 AI 记录并迭代人设模型</span>
                            </div>
                            
                            <div className="relative">
                              {/* Selection Context Pill */}
                              <AnimatePresence>
                                {selectedTextContext && selectedTextContext.text.trim().length > 0 && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                                    className="absolute left-2.5 top-2.5 flex items-center gap-1.5 bg-indigo-100 text-indigo-800 text-[12px] px-2 py-0.5 rounded shadow-sm max-w-[200px] overflow-hidden whitespace-nowrap z-10"
                                  >
                                    <span className="font-bold shrink-0">已选:</span>
                                    <span className="truncate">{selectedTextContext.text}</span>
                                    <button 
                                      onClick={() => setSelectedTextContext(null)}
                                      className="hover:bg-indigo-200 rounded p-0.5 shrink-0"
                                    >
                                      <X size={12} />
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              <input 
                                type="text"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && aiPrompt && !isAiRewriting) {
                                    executeAiRewrite();
                                  }
                                }}
                                placeholder={selectedTextContext && selectedTextContext.text.trim().length > 0 ? "输入指令修改选中内容..." : "输入改写指令，例如：'语气更口语化一些'"}
                                className={`w-full bg-white border border-indigo-200 rounded-lg pr-10 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 transition-all ${
                                  selectedTextContext && selectedTextContext.text.trim().length > 0 ? 'pl-[220px]' : 'pl-3'
                                }`}
                              />
                              <button 
                                onClick={executeAiRewrite}
                                disabled={isAiRewriting || !aiPrompt}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700 disabled:text-indigo-300 bg-indigo-50 p-1.5 rounded-md transition-colors z-10"
                              >
                                {isAiRewriting ? <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" /> : <Send size={14} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-3 relative group">
                          {selectedContent.content.split('\n').map((p, i) => (
                            <p key={i} className="text-[13px] text-neutral-700 leading-relaxed min-h-[1em]">{p}</p>
                          ))}
                          {selectedContent.tags && (
                            <p className="text-[13px] text-indigo-600 font-medium mt-4">{selectedContent.tags}</p>
                          )}
                          <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
                             <span className="bg-white text-neutral-900 px-3 py-1.5 rounded-lg text-[12px] font-bold shadow-sm flex items-center gap-1">
                               <Edit3 size={14} /> 点击右上角进行编辑
                             </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 p-6 text-center h-full">
                <FileText size={48} className="mb-4 text-neutral-200" />
                <p className="text-[14px] font-medium text-neutral-600 mb-1">请在左侧选择一篇内容进行审阅</p>
                <p className="text-[12px]">运营确认修改后，AI将自动学习并优化后续生成的文案人设</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
