import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Bell, TrendingUp, AlertTriangle, ArrowRight, Download, BarChart2, CheckCircle2, ChevronRight, Zap, Sparkles, Users, MessageSquare, Plus, Send, Search, Image as ImageIcon, X } from 'lucide-react';

export default function DataCompass() {
  const [activeAlert, setActiveAlert] = useState<number | null>(null);
  const [activeCompetitor, setActiveCompetitor] = useState<number>(1);
  const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
  const [replySuccess, setReplySuccess] = useState<boolean>(false);

  const COMPETITORS = [
    { id: 1, name: '珀莱雅 PROYA', avatar: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop&q=80', notes: 342, fans: '2.1M' },
    { id: 2, name: '欧莱雅 LOREAL', avatar: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=100&h=100&fit=crop&q=80', notes: 512, fans: '3.4M' },
    { id: 3, name: '薇诺娜 WINONA', avatar: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100&h=100&fit=crop&q=80', notes: 128, fans: '1.2M' },
  ];

  const COMPETITOR_COMMENTS = [
    { id: 1, user: '护肤小天才', content: '这个早C晚A的精华会搓泥吗？我是干皮，之前用过另外一款一直搓泥。', time: '2小时前', intent: '高意向/疑虑', aiSummary: '干皮用户，担忧产品搓泥问题，有购买意向。' },
    { id: 2, user: '夏天要美白', content: '敏敏肌可以用吗？看成分有酸类，怕泛红。', time: '3小时前', intent: '高意向/成分党', aiSummary: '敏感肌，关注酸类成分刺激性，需要温和性保障。' },
    { id: 3, user: '熬夜冠军', content: '双十一活动买一套送多少小样呀？比直播间划算吗？', time: '5小时前', intent: '高意向/比价', aiSummary: '关注大促机制，横向对比直播间优惠力度。' },
  ];

  const handleDispatch = () => {
    setReplySuccess(true);
    setTimeout(() => {
      setReplySuccess(false);
      setShowReplyModal(false);
    }, 2000);
  };

  const ALERTS = [
    {
      id: 1,
      type: 'warning',
      title: '笔记互动率异常偏低',
      desc: '昨日发布的《夏季干皮护肤》首日互动率 1.2%（均值 3.5%）。AI 诊断发现：标题缺乏情绪词，封面与内容关联度弱。',
      action: '查看 AI 改写建议',
      icon: AlertTriangle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      id: 2,
      type: 'opportunity',
      title: '发现竞品热点异动',
      desc: '监测到竞品品牌「欧莱雅」昨晚发布的抗老精华笔记爆量，关键词「早C晚A」检索量飙升 300%。',
      action: '一键生成狙击排期',
      icon: Zap,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      id: 3,
      type: 'action',
      title: '评论区未及时回复',
      desc: '有 12 条高意向询单评论（含“多少钱”、“求链接”）滞留超过 2 小时未回复。',
      action: '一键 AI 批量回复',
      icon: Bell,
      color: 'text-rose-500',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200'
    }
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 flex items-center gap-3">
            <Activity className="text-indigo-600" size={28} />
            AI 运营驾驶舱
          </h2>
          <p className="text-neutral-500 mt-2 font-medium">从数据监控到主动洞察，AI 接管您的业务异常与增长机会</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-bold shadow-md hover:bg-neutral-800 transition-colors">
            <Download size={16} />
            生成月度客户 ROI 报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left: AI Active Push Panel (Direction 1) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-500"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[16px] font-bold flex items-center gap-2 text-neutral-900">
                <Bell size={18} className="text-indigo-500" />
                AI 巡检预警与建议
              </h3>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span> 实时监控中
              </span>
            </div>

            <div className="space-y-4 flex-1">
              {ALERTS.map((alert) => (
                <div 
                  key={alert.id}
                  onMouseEnter={() => setActiveAlert(alert.id)}
                  onMouseLeave={() => setActiveAlert(null)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    activeAlert === alert.id 
                      ? `${alert.bgColor} ${alert.borderColor} shadow-md scale-[1.02]` 
                      : 'bg-white border-neutral-100 hover:border-neutral-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1.5 rounded-lg ${alert.bgColor} ${alert.color}`}>
                      <alert.icon size={16} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-bold text-neutral-900 mb-1">{alert.title}</h4>
                      <p className="text-[12px] text-neutral-500 leading-relaxed mb-3">{alert.desc}</p>
                      
                      <button className={`text-[12px] font-bold flex items-center gap-1 transition-colors ${alert.color} hover:opacity-80`}>
                        {alert.action} <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-[12px] text-neutral-400">
              <span>今日已自动处理 14 个异常</span>
              <a href="#" className="hover:text-neutral-900 transition-colors">查看巡检日志</a>
            </div>
          </div>
        </div>

        {/* Right: Data Insights & ROI (Direction 5) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col space-y-8">
          
          {/* Top Key Metrics */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <div className="text-[13px] text-neutral-500 font-medium mb-2">本月累计曝光 (小红书)</div>
              <div className="text-[32px] font-black text-neutral-900 mb-2">2.4M</div>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                  <TrendingUp size={12} className="mr-1" /> +12.5%
                </span>
                <span className="text-neutral-400">较上月同期</span>
              </div>
            </div>
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="text-[13px] text-neutral-500 font-medium mb-2">整体 CPA (客资成本)</div>
              <div className="text-[32px] font-black text-neutral-900 mb-2">¥42.5</div>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                  <TrendingUp size={12} className="mr-1 rotate-180" /> -8.2%
                </span>
                <span className="text-neutral-400">达到客户 KPI 预期</span>
              </div>
              <CheckCircle2 size={100} className="absolute -right-6 -bottom-6 text-emerald-50 opacity-50" />
            </div>
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm bg-indigo-900 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-[13px] text-indigo-200 font-medium mb-2">预估最终 ROI</div>
                <div className="text-[32px] font-black text-white mb-2">1:3.2</div>
                <div className="flex items-center gap-2 text-[12px]">
                  <span className="flex items-center text-indigo-200">
                    基于当前引流加粉转化率预测
                  </span>
                </div>
              </div>
              <BarChart2 size={120} className="absolute -right-4 -bottom-4 text-indigo-500/30" />
            </div>
          </div>

          {/* AI Action Dashboard */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex-1 flex flex-col">
            <h3 className="text-[16px] font-bold flex items-center gap-2 text-neutral-900 mb-6">
              <Sparkles size={18} className="text-indigo-500" />
              数据到行动 (Data to Action)
            </h3>
            
            <div className="grid grid-cols-2 gap-6 flex-1">
              {/* Insight 1 */}
              <div className="border border-neutral-100 rounded-xl p-5 bg-neutral-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center text-neutral-900 font-bold text-[14px]">01</span>
                    <h4 className="font-bold text-neutral-900">图文与视频转化差扩大</h4>
                  </div>
                  <p className="text-[13px] text-neutral-500 leading-relaxed mb-4">
                    本周数据显示，视频内容的平均获客成本 (CPA ¥35) 已显著低于图文 (CPA ¥52)。然而当前排期中，图文仍占 70%。
                  </p>
                </div>
                <div className="bg-white border border-neutral-200 p-4 rounded-lg">
                  <h5 className="text-[12px] font-bold text-indigo-600 mb-2 flex items-center gap-1"><Zap size={14} /> AI 建议执行动作</h5>
                  <p className="text-[12px] text-neutral-700 mb-3">一键将本周五待发布的 5 篇图文转为混剪视频，并调整下周内容矩阵比例。</p>
                  <button className="w-full bg-neutral-900 text-white text-[12px] font-bold py-2 rounded-md hover:bg-neutral-800 transition-colors">
                    应用比例调整
                  </button>
                </div>
              </div>

              {/* Insight 2 */}
              <div className="border border-neutral-100 rounded-xl p-5 bg-neutral-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center text-neutral-900 font-bold text-[14px]">02</span>
                    <h4 className="font-bold text-neutral-900">痛点引流词「泛红敏感」效率降低</h4>
                  </div>
                  <p className="text-[13px] text-neutral-500 leading-relaxed mb-4">
                    该词的搜索点击率下降 40%。同期，RAG 知识库抓取到小红书平台「换季干痒」的话题热度正在快速上升。
                  </p>
                </div>
                <div className="bg-white border border-neutral-200 p-4 rounded-lg">
                  <h5 className="text-[12px] font-bold text-indigo-600 mb-2 flex items-center gap-1"><Zap size={14} /> AI 建议执行动作</h5>
                  <p className="text-[12px] text-neutral-700 mb-3">调用知识库一键替换草稿箱中 12 篇相关笔记的核心痛点词与 SEO 标签。</p>
                  <button className="w-full bg-white border border-neutral-200 text-neutral-700 text-[12px] font-bold py-2 rounded-md hover:bg-neutral-50 transition-colors flex justify-center items-center gap-1">
                    批量修改标签 <ChevronRight size={14} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Competitor Benchmarking Section */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[18px] font-bold flex items-center gap-2 text-neutral-900">
              <Users size={20} className="text-indigo-600" />
              竞品情报与对标
            </h3>
            <p className="text-[13px] text-neutral-500 mt-1">添加并监控对标账号，AI 自动梳理爆款笔记与高意向评论</p>
          </div>
          <button className="text-[13px] font-bold flex items-center gap-1.5 bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors">
            <Plus size={16} /> 添加对标账号
          </button>
        </div>

        <div className="flex gap-6 h-[400px]">
          {/* Competitor List */}
          <div className="w-1/4 border border-neutral-200 rounded-xl overflow-y-auto custom-scrollbar flex flex-col bg-neutral-50 p-2 space-y-2">
            {COMPETITORS.map((comp) => (
              <div 
                key={comp.id}
                onClick={() => setActiveCompetitor(comp.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors border flex items-center gap-3 ${
                  activeCompetitor === comp.id 
                    ? 'bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-500/10' 
                    : 'bg-white border-transparent hover:border-neutral-200'
                }`}
              >
                <img src={comp.avatar} alt={comp.name} className="w-10 h-10 rounded-full object-cover border border-neutral-100" />
                <div>
                  <h4 className="text-[13px] font-bold text-neutral-900">{comp.name}</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">粉丝 {comp.fans} · 笔记 {comp.notes}</p>
                </div>
              </div>
            ))}
          </div>

          {/* AI Comments Summarization & Dispatch */}
          <div className="flex-1 border border-neutral-200 rounded-xl flex flex-col overflow-hidden bg-white">
            <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
              <h4 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-500" /> AI 重点评论梳理 (近 24 小时)
              </h4>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="text" placeholder="搜索评论关键词..." className="pl-8 pr-3 py-1.5 text-[12px] rounded-lg border border-neutral-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-48" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-neutral-50/30">
              {COMPETITOR_COMMENTS.map((comment) => (
                <div key={comment.id} className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[10px]">
                        {comment.user.charAt(0)}
                      </div>
                      <span className="text-[13px] font-bold text-neutral-900">{comment.user}</span>
                      <span className="text-[11px] text-neutral-400">{comment.time}</span>
                    </div>
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-100">
                      {comment.intent}
                    </span>
                  </div>
                  
                  <p className="text-[13px] text-neutral-700 mb-3 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                    "{comment.content}"
                  </p>
                  
                  <div className="flex items-start gap-2 mb-4">
                    <Sparkles size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-[12px] text-indigo-900/80 leading-relaxed font-medium">
                      AI 洞察：{comment.aiSummary}
                    </p>
                  </div>
                  
                  <div className="flex justify-end pt-3 border-t border-neutral-100">
                    <button 
                      onClick={() => setShowReplyModal(true)}
                      className="text-[12px] font-bold flex items-center gap-1.5 text-white bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <MessageSquare size={14} /> 生成评论回复并指派
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
                    "这个早C晚A的精华会搓泥吗？我是干皮，之前用过另外一款一直搓泥。"
                  </div>
                </div>

                <div>
                  <h4 className="text-[13px] font-bold text-neutral-700 mb-2 flex items-center gap-1">
                    <Sparkles size={14} className="text-indigo-500" /> AI 建议回复文案 (可修改)
                  </h4>
                  <textarea 
                    className="w-full h-24 p-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-[13px] text-neutral-800 resize-none"
                    defaultValue="集美，干皮最怕搓泥啦！推荐你试试我们家的次抛精华，特别添加了玻尿酸成分，质地像水一样，吸收超级快，后续上妆也完全不会搓泥哦～ 现在双十一还有试用装，可以先拍下试试呢！"
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
                  disabled={replySuccess}
                  className={`px-5 py-2 text-[13px] font-bold text-white rounded-lg transition-all flex items-center gap-2 ${
                    replySuccess ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {replySuccess ? (
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
    </div>
  );
}
