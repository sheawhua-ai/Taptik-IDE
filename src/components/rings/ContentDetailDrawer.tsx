import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, CheckCircle2, Bot, ChevronRight, Wand2, FileText, 
  Image as ImageIcon, Compass, Send, CheckCircle, Clock,
  MessageSquare, User, Smartphone, Users, Link
} from 'lucide-react';

const GROUPS = [
  { id: 'official', name: '官方号', countStr: '3 篇可分发', batchAction: '一键下发发布任务', color: 'bg-blue-500' },
  { id: 'kos', name: 'KOS', countStr: '4 篇可分发', batchAction: '一键下发发布任务', color: 'bg-indigo-500' },
  { id: 'koc_general', name: '泛素人分发', countStr: '8 篇已就绪', batchAction: '生成接单任务码', color: 'bg-emerald-500' },
  { id: 'koc_real', name: '真实客户快发', countStr: '30 个额度池', batchAction: '生成门店快发入口', color: 'bg-amber-500' },
];

const MOCK_CONTENT = [
  // 官方号
  {
    id: 'c1',
    channel: 'official',
    channelName: '官方号',
    title: '幼犬软便怎么办？这3个换粮误区你中招了吗？',
    status: '可确认',
    strategy: '专业科普',
    memory: '品牌背书、7日换粮法、无谷配方',
    materials: '官方产品海报、成分拆解图',
    readyForPublish: true,
    content: '作为一名从医5年的宠物医生，接诊过太多因为换粮不当导致肠胃炎的幼犬。今天就来科普一下正确的换粮姿势。\n\n误区一：一次性全部换新粮。幼犬肠胃脆弱，需要7天过渡期（俗称7日换粮法）。\n\n误区二：只看包装不看成分。一定要学会看配料表，首选鲜肉配方，避开肉粉和诱食剂。\n\n选粮建议：推荐肠胃敏感的幼犬选择含有益生菌、无谷低敏配方的狗粮。最近测评的一款国产粮，鲜肉含量高达70%，且添加了枯草芽孢杆菌，对幼犬肠胃非常友好。',
    tags: '#宠物科普 #狗狗软便 #健康养宠'
  },
  // KOS
  {
    id: 'c2',
    channel: 'kos',
    channelName: '员工 KOS',
    title: '店长手记：今天接诊了一只挑食小金毛',
    status: '可确认',
    strategy: '服务记录',
    memory: '线下门店场景、真实服务案例',
    materials: '店面问答实拍图',
    readyForPublish: true,
    content: '今天遇到个特别发愁的客户，说他家金毛挑食得不行。我拿了几个试吃装给金毛，结果它对这款无谷低敏粮情有独钟...\n\n建议家里有挑食修勾的铲屎官，可以试试多换几种口味。',
    tags: '#宠物店日常 #金毛 #挑食狗狗'
  },
  // 泛素人
  {
    id: 'c4',
    channel: 'koc_general',
    channelName: '泛素人分发',
    title: '大学生穷养狗平价好物',
    status: '可分发',
    strategy: '素人种草',
    memory: '大学生、宿舍养宠、平价好物、低营销感',
    materials: '通用生活场景图',
    readyForPublish: true,
    content: '宿舍养狗真的太费钱了！每个月生活费本来就不多，还要给主子买狗粮。做了好多功课才选了这款国产粮，均价才十几块一斤，但是配料表第一位是鲜肉，对于学生党来说真的性价比拉满了。\n\n狗狗吃了快一个月，粑粑正常，毛发也亮亮的，感觉挖到宝了！',
    tags: '#学生党 #平价好物 #养狗日常'
  },
  // 真实客户快发 (池子)
  {
    id: 'c3',
    channel: 'koc_real',
    channelName: '真实客户快发',
    title: '门店快发体验码 (池内 30 个名额)',
    status: '待现场扫码',
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
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [showLearningToast, setShowLearningToast] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiRewriting, setIsAiRewriting] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-[900px] bg-neutral-50 h-full shadow-2xl flex flex-col relative z-10"
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
                <Bot size={14} /> AI 已记录修改，将用于后续人设迭代
              </motion.div>
            )}
            <span className="text-[12px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">已就绪</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧列表 */}
          <div className="w-[320px] bg-white border-r border-neutral-200 flex flex-col h-full overflow-hidden shrink-0">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
              <div className="text-[13px] font-bold text-neutral-500 mb-2">分发控制</div>
              <div className="space-y-2">
                {GROUPS.map(g => (
                  <div key={g.id} className="flex items-center justify-between bg-white border border-neutral-200 p-2.5 rounded-lg shadow-sm">
                    <div>
                      <div className="text-[13px] font-bold text-neutral-900 flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${g.color}`} />
                        {g.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">{g.countStr}</div>
                    </div>
                    <button className="text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1.5 rounded flex items-center gap-1 transition-colors">
                      {g.id === 'koc_general' || g.id === 'koc_real' ? <Smartphone size={12} /> : <Send size={12} />}
                      {g.batchAction}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="text-[12px] font-bold text-neutral-400 px-1 pt-2">详情预览 (抽样)</div>
              {items.map(item => (
                <div 
                  key={item.id}
                  onClick={() => {
                    setSelectedContent(item);
                    setIsEditing(false);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedContent?.id === item.id 
                      ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                      : 'bg-white border-neutral-100 hover:border-neutral-200 hover:shadow-sm'
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
                    <span className="text-[11px] text-neutral-500 font-medium">{item.status}</span>
                  </div>
                  <h4 className="text-[13px] font-bold text-neutral-900 leading-tight mb-2 line-clamp-2">{item.title}</h4>
                </div>
              ))}
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
                            className="text-[12px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg"
                            onClick={() => {
                              setIsEditing(true);
                              setEditTitle(selectedContent.title);
                              setEditContent(selectedContent.content);
                              setEditTags(selectedContent.tags || "");
                            }}
                          >
                            GUI + AI 智能编辑
                          </button>
                        )}
                        {isEditing && (
                          <button 
                            className="text-[12px] font-bold text-neutral-600 hover:text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-lg"
                            onClick={() => {
                              setIsEditing(false);
                              const updated = {...selectedContent, title: editTitle, content: editContent, tags: editTags, status: '已审阅'};
                              setSelectedContent(updated);
                              setItems(items.map(i => i.id === updated.id ? updated : i));
                              setShowLearningToast(true);
                              setTimeout(() => setShowLearningToast(false), 3000);
                            }}
                          >
                            保存修改
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
                            <label className="block text-[12px] font-bold text-neutral-500 mb-1">正文</label>
                            <textarea
                              value={editContent}
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
                          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Bot size={16} className="text-indigo-600" />
                                <span className="text-[13px] font-bold text-indigo-900">AI 辅助与自学习</span>
                              </div>
                              <span className="text-[11px] text-indigo-600/70 bg-indigo-100/50 px-2 py-0.5 rounded">修改将同步至人设记忆库</span>
                            </div>
                            <div className="relative">
                              <input 
                                type="text"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && aiPrompt && !isAiRewriting) {
                                    setIsAiRewriting(true);
                                    setTimeout(() => {
                                      setIsAiRewriting(false);
                                      setEditContent(editContent + "\n\n[AI已根据您的要求润色，语气更口语化]");
                                      setAiPrompt("");
                                    }, 1500);
                                  }
                                }}
                                placeholder="输入改写指令，例如：'语气更口语化一些'"
                                className="w-full bg-white border border-indigo-200 rounded-lg pl-3 pr-10 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400"
                              />
                              <button 
                                onClick={() => {
                                  if(!aiPrompt) return;
                                  setIsAiRewriting(true);
                                  setTimeout(() => {
                                    setIsAiRewriting(false);
                                    setEditContent(editContent + "\n\n[AI已根据您的要求润色，语气更口语化]");
                                    setAiPrompt("");
                                  }, 1500);
                                }}
                                disabled={isAiRewriting || !aiPrompt}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700 disabled:text-indigo-300 bg-indigo-50 p-1.5 rounded-md transition-colors"
                              >
                                {isAiRewriting ? <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" /> : <Send size={14} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm space-y-3">
                          {selectedContent.content.split('\n').map((p, i) => (
                            <p key={i} className="text-[13px] text-neutral-700 leading-relaxed min-h-[1em]">{p}</p>
                          ))}
                          {selectedContent.tags && (
                            <p className="text-[13px] text-indigo-600 font-medium">{selectedContent.tags}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 p-6 text-center h-full">
                <FileText size={48} className="mb-4 text-neutral-200" />
                <p className="text-[14px] font-medium text-neutral-600 mb-1">请在左侧选择一篇内容或任务</p>
                <p className="text-[12px]">可通过分组面板进行批量分发操作</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
