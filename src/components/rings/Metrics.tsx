import React, { useState } from 'react';
import { DataCenter } from '../DataCenter';
import { 
  Activity, ArrowUp, ArrowUpRight, MessageSquare, Target, 
  LineChart, Sparkles, AlertTriangle, ShieldAlert,
  Flame, TrendingDown, Eye, UserX, Image, X, ArrowRight,
  Send, CheckCircle2, Zap, Save, BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EventItem {
  id: string;
  type: string;
  title: string;
  icon: any;
  color: string;
  bgColor: string;
  evidence: string;
  impact: string;
  aiSuggestion: string;
  actionText: string;
  module: string;
}

const MOCK_EVENTS: EventItem[] = [
  {
    id: 'e1',
    type: '爆文苗子',
    title: '幼犬挑食其实是你的锅',
    icon: Flame,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    evidence: '发布 3 小时互动率高于账号均值 2.4 倍，评论集中在“换粮软便”。',
    impact: '影响当前“幼犬换粮”项目',
    aiSuggestion: '建议追加 10 篇同方向变体，并沉淀为下一轮操盘建议。',
    actionText: '创建追加内容',
    module: '项目与内容'
  },
  {
    id: 'e2',
    type: '账号异常',
    title: '小红书账号「养宠日记」流量骤降',
    icon: ShieldAlert,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    evidence: '连续 3 篇笔记播放量低于 500，疑似触碰平台限流规则。',
    impact: '影响主账号矩阵分发',
    aiSuggestion: '建议暂停该账号发布 3 天，安排人工检查是否存在违规词。',
    actionText: '调整账号发布策略',
    module: '账号与发布'
  },
  {
    id: 'e3',
    type: '高价值评论',
    title: '关于“冻干猫粮”的 2 条意向评论',
    icon: MessageSquare,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    evidence: '评论包含明确购买意向：“求链接”、“怎么买”。',
    impact: '影响潜在转化线索',
    aiSuggestion: '建议立即回复，并推送到客服企微群。',
    actionText: '生成评论回复并指派',
    module: '协同任务'
  },
  {
    id: 'e4',
    type: '素材表现好',
    title: '实拍+大字报封面点击率创新高',
    icon: Image,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    evidence: '该素材组合点击率达 15%，比历史平均高 40%。',
    impact: '可大幅提升后续笔记点击率',
    aiSuggestion: '将此类封面加入优质素材库，并在接下来的项目中优先使用。',
    actionText: '标记为优质素材',
    module: '素材库'
  }
];

export const Metrics: React.FC<{ hasData?: boolean }> = ({ hasData = true }) => {
  const [dataSubNav, setDataSubNav] = useState('opportunities');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);

  const handleDispatch = () => {
    setActionSuccess(true);
    setTimeout(() => {
      setActionSuccess(false);
      setShowReplyModal(false);
    }, 2000);
  };

  const handleSaveMemory = () => {
    setActionSuccess(true);
    setTimeout(() => {
      setActionSuccess(false);
      setShowMemoryModal(false);
    }, 2000);
  };
  
  if (!hasData) {
    return (
      <div className="flex flex-col h-full bg-white overflow-hidden items-center justify-center p-20 text-center">
        <div className="w-32 h-32 bg-indigo-50 rounded-[48px] flex items-center justify-center text-indigo-400 mb-8 animate-pulse">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <h3 className="text-2xl font-semibold text-neutral-900 mb-4">暂无触达与转化分析数据</h3>
        <p className="text-neutral-400 max-w-md leading-relaxed">
          当您在“账号与分发”执行发布后，系统将自动汇总各平台的流量反馈，并在这里为您呈现 ROI 增长曲线。
        </p>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: 'content' } }))}
          className="mt-10 px-8 py-4 bg-neutral-900 text-white rounded-2xl text-[14px] shadow-xl shadow-neutral-200 hover:bg-primary-500 transition-all"
        >
          去生产第一篇内容
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-white overflow-hidden">
      {/* 侧边导航与列表 */}
      <div className="w-[280px] border-r border-neutral-100 flex flex-col h-full bg-[#fafafa] shrink-0">
        <div className="p-8 border-b border-neutral-100 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">数据与机会</h2>
              <p className="text-[11px] text-neutral-400 mt-1">
                把数据转成下一步操盘动作
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-1">
          {[
            { id: 'opportunities', name: '机会事件流', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { id: 'dashboards', name: '数据工作区', icon: 'M5 12h14M12 5l7 7-7 7' },
            { id: 'roi_attribution', name: '效果归因', icon: 'M12 20V10M18 20V4M6 20v-4' },
            { id: 'scheduled', name: '复盘报告', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'blueocean', name: '蓝海机会', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
          ].map((btn) => (
            <button 
              key={btn.id}
              onClick={() => setDataSubNav(btn.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] transition-all ${dataSubNav === btn.id ? 'bg-white text-primary-500 shadow-sm border border-neutral-100 font-medium' : 'text-neutral-500 hover:bg-neutral-100 font-medium'}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={btn.icon}/></svg>
              {btn.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative bg-neutral-50/30">
        {dataSubNav === 'opportunities' ? (
          <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-8">
            {/* Top AI Insight */}
            <div className="bg-neutral-900 text-white rounded-[32px] p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shrink-0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <Sparkles size={24} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="text-[12px] text-white/50 font-bold uppercase tracking-widest mb-1.5">AI 数据巡航</h3>
                  <p className="text-[16px] leading-relaxed">
                    过去 24 小时发现 6 个机会/风险：2 篇笔记表现突增，1 个账号疑似限流，2 条评论高意向，1 个素材组合点击率高。
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[13px] font-medium transition-colors">
                  查看完整数据
                </button>
                <button className="px-5 py-2.5 bg-white text-neutral-900 rounded-xl text-[13px] font-bold hover:bg-neutral-100 transition-colors shadow-sm">
                  处理数据机会
                </button>
              </div>
            </div>

            {/* Event Stream */}
            <div className="space-y-4 max-w-4xl">
              {MOCK_EVENTS.map(event => (
                <div key={event.id} className="bg-white border border-neutral-200 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${event.bgColor} ${event.color}`}>
                          <event.icon size={14} />
                          {event.type}
                        </div>
                        <h4 className="text-[16px] font-semibold text-neutral-900">{event.title}</h4>
                      </div>
                      <div className="space-y-3 mb-5 pl-2 border-l-2 border-neutral-100">
                        <div className="flex items-start gap-2">
                          <span className="text-[11px] font-bold text-neutral-400 mt-0.5 shrink-0">证据:</span>
                          <span className="text-[13px] text-neutral-700">{event.evidence}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-[11px] font-bold text-neutral-400 mt-0.5 shrink-0">影响:</span>
                          <span className="text-[13px] text-neutral-700">{event.impact}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-[11px] font-bold text-primary-500 mt-0.5 shrink-0">建议:</span>
                          <span className="text-[13px] text-neutral-900 font-medium">{event.aiSuggestion}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-neutral-100 pt-4 md:pt-0 md:pl-6 justify-center">
                      <button 
                        onClick={() => setSelectedEvent(event)}
                        className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[13px] font-bold shadow-sm transition-colors text-center w-full md:w-auto"
                      >
                        {event.actionText}
                      </button>
                      <button 
                        onClick={() => setSelectedEvent(event)}
                        className="px-5 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-xl text-[13px] font-medium transition-colors text-center w-full md:w-auto"
                      >
                        查看证据
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full relative">
            <DataCenter dataSubNav={dataSubNav} setDataSubNav={setDataSubNav} setActiveNav={() => {}} />
          </div>
        )}

        {/* Right Drawer for Event Handling */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 w-[400px] bg-white border-l border-neutral-200 shadow-2xl z-20 flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100 shrink-0 bg-neutral-900 text-white">
                <h3 className="font-semibold text-[15px]">处理机会</h3>
                <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                <div>
                  <div className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider items-center gap-1.5 mb-3 ${selectedEvent.bgColor} ${selectedEvent.color}`}>
                    <selectedEvent.icon size={14} />
                    {selectedEvent.type}
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900">{selectedEvent.title}</h2>
                </div>

                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
                  <h4 className="text-[12px] font-bold text-neutral-900 mb-2 uppercase tracking-widest">证据数据</h4>
                  <p className="text-[14px] text-neutral-600 leading-relaxed">{selectedEvent.evidence}</p>
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                     <h4 className="text-[12px] font-bold text-neutral-900 mb-2 uppercase tracking-widest">AI 判断依据</h4>
                     <p className="text-[14px] text-neutral-600 leading-relaxed">
                       基于历史 30 天数据模型，当前指标偏离均值 2 个标准差，符合高潜/高危特征。
                     </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[12px] font-bold text-neutral-400 mb-3 uppercase tracking-widest">涉及对象</h4>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-[13px] rounded-lg border border-neutral-200 font-medium">
                      {selectedEvent.impact}
                    </span>
                  </div>
                </div>

                <div className="bg-neutral-50/80 rounded-2xl p-5 border border-neutral-100">
                  <h4 className="text-[12px] font-bold text-neutral-900 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" /> 推荐动作
                  </h4>
                  <p className="text-[14px] text-neutral-900 font-medium leading-relaxed">{selectedEvent.aiSuggestion}</p>
                </div>
              </div>

              <div className="p-6 border-t border-neutral-100 bg-white space-y-3">
                <button 
                  onClick={() => {
                    if (selectedEvent.id === 'e1') {
                      setSelectedEvent(null);
                      window.dispatchEvent(
                        new CustomEvent("nav-to-tab", { detail: { tab: "matrix" } })
                      );
                    } else if (selectedEvent.id === 'e2') {
                      setSelectedEvent(null);
                      window.dispatchEvent(
                        new CustomEvent("nav-to-tab", { detail: { tab: "content" } })
                      );
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent("open-modify-schedule"));
                      }, 100);
                    } else if (selectedEvent.id === 'e3') {
                      setShowReplyModal(true);
                      setSelectedEvent(null);
                    } else if (selectedEvent.id === 'e4') {
                      setShowMemoryModal(true);
                      setSelectedEvent(null);
                    }
                  }}
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[14px] font-bold shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  {selectedEvent.actionText} <ArrowRight size={16} />
                </button>
                <div className="text-center text-[11px] text-neutral-400 font-medium pb-2">
                  执行后将回流至「{selectedEvent.module}」模块
                </div>
                
                <div className="relative mt-4">
                  <input
                    type="text"
                    placeholder="告诉 AI 你的判断，例如：这几篇不是内容问题，是账号被限流。"
                    className="w-full pl-4 pr-10 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[12px] placeholder:text-neutral-400 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/10 transition-all"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-neutral-900 text-white rounded-lg flex items-center justify-center hover:bg-neutral-800 transition-colors">
                    <ArrowUp size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
            >
              <div className="p-5 flex justify-between items-center border-b border-neutral-100 bg-neutral-50/50">
                <h3 className="font-bold text-[16px] text-neutral-900 flex items-center gap-2">
                  <MessageSquare size={18} className="text-indigo-600" /> AI 截流回复生成与指派
                </h3>
                <button onClick={() => setShowReplyModal(false)} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <h4 className="text-[13px] font-bold text-neutral-700 mb-2">待截流用户评论</h4>
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-[13px] text-neutral-600">
                    "这个幼犬换粮的链接在哪里呀？我家狗狗也是一直软便。"
                  </div>
                </div>

                <div>
                  <h4 className="text-[13px] font-bold text-neutral-700 mb-2 flex items-center gap-1">
                    <Sparkles size={14} className="text-indigo-500" /> AI 建议回复文案 (可修改)
                  </h4>
                  <textarea 
                    className="w-full h-24 p-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-[13px] text-neutral-800 resize-none"
                    defaultValue="亲亲，小狗软便千万别大意！我们这款幼犬专用粮特别添加了益生菌，能很好呵护肠胃哦~ 购买链接在这边，现在下单还有新客优惠呢！"
                  />
                  <div className="flex justify-end mt-2 gap-2">
                    <button className="text-[12px] text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1"><Zap size={12} /> 换个语气</button>
                  </div>
                </div>

                <div>
                  <h4 className="text-[13px] font-bold text-neutral-700 mb-2">指派到对应企微账号执行跟进</h4>
                  <select className="w-full p-2.5 rounded-lg border border-neutral-200 text-[13px] text-neutral-900 focus:outline-none focus:border-indigo-500">
                    <option value="kefu1">企微客服 - 小雅 (当前在线)</option>
                    <option value="kefu2">企微客服 - 大潘 (已接待 12 人)</option>
                    <option value="kefu3">私域运营 - 李明</option>
                  </select>
                </div>
              </div>

              <div className="p-5 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3">
                <button 
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 text-[13px] font-bold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleDispatch}
                  disabled={actionSuccess}
                  className={`px-5 py-2 text-[13px] font-bold text-white rounded-lg transition-all flex items-center gap-2 ${
                    actionSuccess ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {actionSuccess ? (
                    <><CheckCircle2 size={16} /> 已成功推送至企微</>
                  ) : (
                    <><Send size={16} /> 确认并一键指派</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Memory Extract Modal */}
      <AnimatePresence>
        {showMemoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
            >
              <div className="p-5 flex justify-between items-center border-b border-neutral-100 bg-neutral-50/50">
                <h3 className="font-bold text-[16px] text-neutral-900 flex items-center gap-2">
                  <BrainCircuit size={18} className="text-emerald-600" /> 沉淀至知识库记忆
                </h3>
                <button onClick={() => setShowMemoryModal(false)} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <h4 className="text-[13px] font-bold text-neutral-700 mb-2">优质素材信息</h4>
                  <div className="flex gap-4 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                    <div className="w-16 h-16 bg-neutral-200 rounded-md flex items-center justify-center text-neutral-400 shrink-0">
                      <Image size={24} />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-neutral-900 mb-1">该素材组合点击率达 15%</div>
                      <div className="text-[12px] text-neutral-500">点击率比历史平均高 40%</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[13px] font-bold text-neutral-700 mb-2 flex items-center gap-1">
                    <Sparkles size={14} className="text-emerald-500" /> AI 提取构图与要素 (可用于后续生图提示词)
                  </h4>
                  <textarea 
                    className="w-full h-28 p-3 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-[13px] text-neutral-800 resize-none"
                    defaultValue="- 画面主体：幼犬正面特写，眼神清澈委屈
- 背景环境：暖色调家居环境（浅木色地板+米色沙发）
- 文字排版：顶部居中大字加粗标红「幼犬软便必看」，底部辅助小字说明
- 核心情绪：引发主人的共情与焦虑感"
                  />
                </div>
              </div>

              <div className="p-5 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3">
                <button 
                  onClick={() => setShowMemoryModal(false)}
                  className="px-4 py-2 text-[13px] font-bold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveMemory}
                  disabled={actionSuccess}
                  className={`px-5 py-2 text-[13px] font-bold text-white rounded-lg transition-all flex items-center gap-2 ${
                    actionSuccess ? 'bg-emerald-500' : 'bg-neutral-900 hover:bg-neutral-800'
                  }`}
                >
                  {actionSuccess ? (
                    <><CheckCircle2 size={16} /> 已沉淀为商家记忆</>
                  ) : (
                    <><Save size={16} /> 保存为运营记忆</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
