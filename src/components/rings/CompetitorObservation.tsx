import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Eye, Filter, CheckCircle2,
  Clock, X, ArrowRight, MessageSquare, ListChecks, ArrowUpRight, Sparkles
} from 'lucide-react';

export function CompetitorObservation() {
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [activeTopic, setActiveTopic] = useState('t1');
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const topics = [
    { id: 't1', name: '幼犬换粮软便', notesCount: 6, newComments: 28 },
    { id: 't2', name: '狗粮适口性对比', notesCount: 4, newComments: 15 },
    { id: 't3', name: '低敏粮痛点', notesCount: 3, newComments: 8 },
  ];

  const notes = [
    { id: 'n1', brand: '竞品A', title: '幼犬换粮必看，不拉稀的秘密', author: '养狗小能手', time: '10分钟前', comments: 12, valid: 5, painPoints: '换粮后频繁拉稀、便血', insights: { frequency: '软便 (45%)', category: '负面反馈', opportunity: '强调成分温和及益生菌添加', interceptable: 3 } },
    { id: 'n2', brand: '竞品B', title: '三个月小狗怎么选粮？', author: '柯基主理人', time: '1小时前', comments: 8, valid: 2, painPoints: '颗粒太大不好咬、挑食', insights: { frequency: '颗粒大 (30%)', category: '产品疑问', opportunity: '展示小颗粒设计及适口性测试', interceptable: 1 } },
  ];

  return (
    <div className="h-full flex flex-col bg-[#fcfcfc] overflow-hidden text-neutral-900 relative">
      {/* Top Header */}
      <div className="px-8 py-5 border-b border-neutral-100 bg-white shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[24px] font-bold text-neutral-900">3</span>
              <span className="text-[12px] text-neutral-500 font-medium">观察主题</span>
            </div>
            <div className="w-px h-8 bg-neutral-200"></div>
            <div className="flex flex-col">
              <span className="text-[24px] font-bold text-neutral-900">13</span>
              <span className="text-[12px] text-neutral-500 font-medium">监测笔记</span>
            </div>
            <div className="w-px h-8 bg-neutral-200"></div>
            <div className="flex flex-col">
              <span className="text-[24px] font-bold text-neutral-900">51</span>
              <span className="text-[12px] text-neutral-500 font-medium">新增评论</span>
            </div>
            <div className="w-px h-8 bg-neutral-200"></div>
            <div className="flex flex-col">
              <span className="text-[24px] font-bold text-primary-600">18</span>
              <span className="text-[12px] text-neutral-500 font-medium">有效需求</span>
            </div>
          </div>
          <button 
            onClick={() => setShowAddDrawer(true)}
            className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> 添加观察对象
          </button>
        </div>
        <div className="flex items-center gap-4 text-[12px] text-neutral-500">
          <span className="flex items-center gap-1"><Clock size={14} /> 最近扫描：10分钟前</span>
          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded"><CheckCircle2 size={14} /> 电脑在线时自动扫描</span>
        </div>
      </div>

      {/* Main Three Columns */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left: Topics */}
        <div className="w-[260px] border-r border-neutral-100 bg-white flex flex-col shrink-0">
          <div className="p-4 border-b border-neutral-100">
            <h3 className="text-[13px] font-bold text-neutral-900">观察主题</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {topics.map(t => (
              <div 
                key={t.id}
                onClick={() => { setActiveTopic(t.id); setActiveNote(null); }}
                className={`p-3 rounded-xl cursor-pointer transition-colors ${activeTopic === t.id ? 'bg-primary-50 border border-primary-100' : 'hover:bg-neutral-50 border border-transparent'}`}
              >
                <div className="text-[14px] font-bold text-neutral-900 mb-1">{t.name}</div>
                <div className="text-[12px] text-neutral-500 flex items-center justify-between">
                  <span>{t.notesCount} 篇笔记</span>
                  <span className="text-primary-600 font-medium">+{t.newComments} 评论</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Notes */}
        <div className="flex-1 border-r border-neutral-100 bg-neutral-50/50 flex flex-col min-w-[400px]">
          <div className="p-4 border-b border-neutral-100 bg-white flex items-center justify-between shrink-0">
            <h3 className="text-[13px] font-bold text-neutral-900">监测笔记</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {notes.map(n => (
              <div 
                key={n.id}
                className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer ${activeNote === n.id ? 'border-primary-500 shadow-md ring-2 ring-primary-50' : 'border-neutral-200 shadow-sm hover:border-neutral-300'}`}
                onClick={() => setActiveNote(n.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[11px] font-bold">{n.brand}</span>
                    <span className="text-[12px] text-neutral-500">{n.author}</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1"><Clock size={12} /> {n.time}</span>
                </div>
                <h4 className="text-[15px] font-bold text-neutral-900 mb-3">{n.title}</h4>
                <div className="bg-neutral-50 rounded-xl p-3 mb-4">
                  <div className="text-[12px] font-bold text-neutral-500 mb-1">高频痛点/问题</div>
                  <div className="text-[13px] text-neutral-700">{n.painPoints}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[12px]">
                    <span className="text-neutral-500">新增评论 <strong className="text-neutral-900">{n.comments}</strong></span>
                    <span className="text-primary-600">有效需求 <strong>{n.valid}</strong></span>
                  </div>
                  <button className="text-[12px] font-bold text-primary-600 flex items-center gap-1 group">
                    查看评论洞察 <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Insights */}
        <div className="w-[360px] bg-white flex flex-col shrink-0 relative">
          {activeNote ? (
            <div className="flex flex-col h-full absolute inset-0 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-white shrink-0">
                <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
                  <Eye size={16} className="text-primary-600" />
                  评论洞察
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div>
                  <h4 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider mb-3">高频问题与提及比例</h4>
                  <div className="text-[15px] font-bold text-neutral-900">{notes.find(n => n.id === activeNote)?.insights.frequency}</div>
                </div>
                
                <div>
                  <h4 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider mb-3">语义分类</h4>
                  <div className="inline-block px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[13px] font-bold">
                    {notes.find(n => n.id === activeNote)?.insights.category}
                  </div>
                </div>

                <div>
                  <h4 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider mb-3">用户原话样例</h4>
                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 space-y-3">
                    <p className="text-[13px] text-neutral-700 italic">"我家狗吃这个怎么总是软便啊？"</p>
                    <p className="text-[13px] text-neutral-700 italic">"按比例换的，还是拉稀，无语了。"</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider mb-3">内容机会 (AI判定)</h4>
                  <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 text-[13px] text-primary-900 font-medium">
                    {notes.find(n => n.id === activeNote)?.insights.opportunity}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                   <div className="flex items-center justify-between mb-4">
                     <span className="text-[13px] font-bold text-neutral-900">可承接评论</span>
                     <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[12px] font-bold">{notes.find(n => n.id === activeNote)?.insights.interceptable} 条</span>
                   </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-neutral-100 bg-neutral-50 space-y-3 shrink-0">
                <button className="w-full py-2.5 bg-neutral-900 text-white rounded-xl text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm">
                  加入本轮策略依据
                </button>
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors text-center">
                    生成内容方向
                  </button>
                  <button className="flex-1 py-2.5 bg-white border border-neutral-200 text-primary-600 rounded-xl text-[13px] font-bold hover:bg-neutral-50 transition-colors text-center">
                    查看截流机会
                  </button>
                </div>
                <button className="w-full text-center text-[12px] font-bold text-neutral-400 hover:text-neutral-600 py-1">
                  暂不采用
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400 p-8 text-center">
              <Eye size={48} className="mb-4 opacity-20" />
              <p className="text-[14px] font-medium text-neutral-500">选择左侧笔记<br/>查看深度评论洞察</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Target Drawer */}
      <AnimatePresence>
        {showAddDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddDrawer(false)}
              className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="absolute top-0 right-0 bottom-0 w-[440px] bg-white shadow-2xl z-[101] flex flex-col border-l border-neutral-200"
            >
              <div className="shrink-0 border-b border-neutral-100 p-6 flex justify-between items-center">
                <h2 className="text-[18px] font-bold text-neutral-900">添加观察对象</h2>
                <button
                  onClick={() => setShowAddDrawer(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-[13px] font-bold text-neutral-700 mb-2">竞品笔记链接 / ID</label>
                  <textarea 
                    className="w-full border border-neutral-200 rounded-xl p-3 text-[14px] text-neutral-900 focus:outline-none focus:border-primary-500 resize-none h-24"
                    placeholder="在此粘贴小红书笔记链接..."
                  />
                  <div className="mt-2 text-[12px] text-neutral-500 flex items-center gap-1">
                    <Sparkles size={12} className="text-primary-500" />
                    系统将自动识别标题、作者与所属竞品
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-neutral-700 mb-2">观察主题</label>
                  <input 
                    type="text"
                    className="w-full border border-neutral-200 rounded-xl p-3 text-[14px] text-neutral-900 focus:outline-none focus:border-primary-500"
                    placeholder="例如：幼犬换粮软便"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-neutral-700 mb-2">关注词 (可选)</label>
                  <input 
                    type="text"
                    className="w-full border border-neutral-200 rounded-xl p-3 text-[14px] text-neutral-900 focus:outline-none focus:border-primary-500"
                    placeholder="例如：拉稀、适口性、推荐、怎么买"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-neutral-100 bg-neutral-50 shrink-0">
                <button 
                  onClick={() => setShowAddDrawer(false)}
                  className="w-full py-3.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  开始观察
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
