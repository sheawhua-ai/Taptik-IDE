import React, { useState } from 'react';
import { 
  Search, Filter, MessageSquare, Flame, CheckCircle2, 
  Clock, User, Send, ExternalLink, MoreVertical, 
  ChevronDown, AlertCircle, TrendingUp, ShieldAlert, Zap,
  MessageCircle, Smartphone, UserPlus, BookOpen, Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Lead {
  id: string;
  user: string;
  avatar: string;
  content: string;
  type: 'dm' | 'comment';
  source?: string; // Note title if comment
  time: string;
  intent: 'high' | 'medium' | 'low';
  intentScore: number;
  status: 'pending' | 'replied' | 'ignored';
  accountName: string;
  wechatAdded?: boolean;
}

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    user: '旅行小达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12',
    content: '请问咱们这套护肤品对敏感肌友好吗？想了解一下拿货价。',
    type: 'dm',
    time: '2分钟前',
    intent: 'high',
    intentScore: 98,
    status: 'pending',
    accountName: '官方旗舰店小红书',
    wechatAdded: false
  },
  {
    id: '2',
    user: '花花鸭',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    content: '求购买链接！找了好久了😭',
    type: 'comment',
    source: '《终于找到本命高光，黄皮绝了》',
    time: '15分钟前',
    intent: 'high',
    intentScore: 92,
    status: 'pending',
    accountName: '素人KOC-李子',
  },
  {
    id: '3',
    user: '默默',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
    content: '这件衣服多少钱呀？',
    type: 'comment',
    source: '《春日穿搭OOTD｜微胖女孩的显瘦秘籍》',
    time: '1小时前',
    intent: 'medium',
    intentScore: 75,
    status: 'replied',
    accountName: '矩阵号-小A',
  }
];

export const Interaction: React.FC<{ hasData?: boolean }> = ({ hasData = true }) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'dm' | 'comment'>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(hasData ? MOCK_LEADS[0] : null);
  const [aiAutoReply, setAiAutoReply] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'sop'>('leads');

  const filteredLeads = MOCK_LEADS.filter(lead => {
    if (filter === 'all') return true;
    if (filter === 'high') return lead.intent === 'high';
    if (filter === 'dm') return lead.type === 'dm';
    if (filter === 'comment') return lead.type === 'comment';
    return true;
  });

  if (!hasData) {
    return (
      <div className="flex h-full w-full bg-white overflow-hidden items-center justify-center">
         <div className="max-w-md w-full p-12 bg-white rounded-[64px] border border-neutral-100 shadow-2xl shadow-neutral-200/50 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-rose-50 rounded-[32px] flex items-center justify-center text-rose-500 mb-10 group hover:rotate-12 transition-transform">
               <Flame size={48} className="fill-current" />
            </div>
            <h3 className="text-2xl font-black text-neutral-900 mb-4 italic tracking-tight">客资转化引擎已上线</h3>
            <p className="text-[14px] text-neutral-400 font-bold leading-relaxed mb-10">
               全天候监控矩阵账号的私信与评论，由 AI 自动捕捉高意向客资，辅助加企微，生成销售 SOP。
            </p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-white overflow-hidden">
      {/* 侧边导航与列表 */}
      <div className="w-[450px] border-r border-neutral-100 flex flex-col h-full bg-[#fafafa]">
        <div className="p-8 border-b border-neutral-100 bg-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight">客资运营与转化</h2>
              <p className="text-[11px] font-bold text-neutral-400 mt-1 flex items-center gap-1.5">
                <Smartphone size={12} className="text-emerald-500"/> 多账号私信/评论监控
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
             <button 
                onClick={() => setActiveTab('leads')}
                className={`px-4 py-2 rounded-xl text-[13px] font-black transition-colors ${activeTab === 'leads' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
             >
                线索跟进
             </button>
             <button 
                onClick={() => setActiveTab('sop')}
                className={`px-4 py-2 rounded-xl text-[13px] font-black transition-colors ${activeTab === 'sop' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
             >
                销售 SOP 管理
             </button>
          </div>
        </div>

        {activeTab === 'leads' && (
           <>
             <div className="px-6 py-4 bg-white border-b border-neutral-100">
               <div className="flex gap-2 bg-neutral-50 p-1.5 rounded-xl">
                 {[
                   { id: 'all', name: '全部' },
                   { id: 'high', name: '高意向' },
                   { id: 'dm', name: '私信' },
                   { id: 'comment', name: '评论' }
                 ].map((btn) => (
                   <button 
                     key={btn.id}
                     onClick={() => setFilter(btn.id as any)}
                     className={`flex-1 py-1.5 rounded-lg text-[11px] font-black transition-all ${filter === btn.id ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                   >
                     {btn.name}
                   </button>
                 ))}
               </div>
             </div>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar">
               <div className="p-4 space-y-3">
                 {filteredLeads.map(lead => (
                   <button 
                     key={lead.id}
                     onClick={() => setSelectedLead(lead)}
                     className={`w-full text-left p-5 rounded-[24px] transition-all border relative ${selectedLead?.id === lead.id ? 'bg-white border-primary-500 shadow-xl shadow-primary-500/10 z-10' : 'bg-white border-neutral-100 hover:border-neutral-200'}`}
                   >
                     {lead.intent === 'high' && (
                        <div className="absolute top-5 right-5 flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-lg">
                           <Flame size={12} className="text-rose-500" />
                           <span className="text-[10px] font-black text-rose-500">高意向</span>
                        </div>
                     )}
                     <div className="flex items-center gap-3 mb-3">
                       <img src={lead.avatar} className="w-10 h-10 rounded-full border border-neutral-100" alt="" />
                       <div>
                         <div className="text-[14px] font-black text-neutral-900">{lead.user}</div>
                         <div className="flex items-center gap-2 mt-0.5">
                           <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-black ${lead.type === 'dm' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
                              {lead.type === 'dm' ? '私信' : '评论'}
                           </span>
                           <span className="text-[10px] font-bold text-neutral-400 truncate max-w-[120px]">{lead.accountName}</span>
                         </div>
                       </div>
                     </div>
                     <p className="text-[13px] font-bold text-neutral-700 mb-3 line-clamp-2 leading-relaxed">
                       {lead.content}
                     </p>
                     <div className="flex items-center justify-between pt-3 border-t border-neutral-50">
                         <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{lead.time}</span>
                         <span className="text-[11px] font-black text-emerald-500">意向分: {lead.intentScore}</span>
                     </div>
                   </button>
                 ))}
               </div>
             </div>
           </>
        )}

        {activeTab === 'sop' && (
           <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6 bg-white">
              <div className="p-6 bg-neutral-50 rounded-[24px] border border-neutral-100 hover:border-primary-200 transition-colors cursor-pointer group">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><BookOpen size={16} /></div>
                    <h3 className="text-[14px] font-black text-neutral-900 group-hover:text-primary-500 transition-colors">夏季防晒产品 - 转化话术库</h3>
                 </div>
                 <p className="text-[12px] text-neutral-500 font-bold">针对价格敏感、效果成分询问等高频问题，基于 1,200 条成交记录提炼。</p>
              </div>
              <div className="p-6 bg-neutral-50 rounded-[24px] border border-neutral-100 hover:border-primary-200 transition-colors cursor-pointer group">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500"><UserPlus size={16} /></div>
                    <h3 className="text-[14px] font-black text-neutral-900 group-hover:text-primary-500 transition-colors">企微私域引流 SOP</h3>
                 </div>
                 <p className="text-[12px] text-neutral-500 font-bold">福利诱饵设计、钩子发送时机，成功引流率高达 45%。</p>
              </div>
              <button className="w-full py-4 rounded-[20px] border-2 border-dashed border-neutral-200 text-neutral-400 font-black text-[13px] hover:border-primary-500 hover:text-primary-500 transition-colors flex flex-col items-center gap-2">
                 <Bot size={20} />
                 AI 自动总结近期销冠 SOP
              </button>
           </div>
        )}
      </div>

      {/* 主工作区 */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'leads' && selectedLead ? (
          <div className="flex-1 flex flex-col bg-white">
            <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-4">
                <img src={selectedLead.avatar} className="w-11 h-11 rounded-full border-2 border-neutral-100" alt="" />
                <div>
                  <h3 className="text-[16px] font-black text-neutral-900 tracking-tight">{selectedLead.user}</h3>
                  <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-neutral-400">来自账号: {selectedLead.accountName}</span>
                      <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{selectedLead.type === 'dm' ? '私信互动中' : '评论活跃'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!selectedLead.wechatAdded && (
                  <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[12px] font-black hover:bg-emerald-100 transition-all flex items-center gap-2">
                    <UserPlus size={14}/> 引导加企微
                  </button>
                )}
                {selectedLead.type === 'comment' && (
                  <button className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-black flex items-center gap-2 hover:bg-neutral-800">
                    跳转至笔记处理 <ExternalLink size={14}/>
                  </button>
                )}
                <button className="p-2 bg-neutral-50 text-neutral-400 rounded-xl hover:bg-neutral-100 border border-neutral-100">
                  <MoreVertical size={18}/>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 bg-neutral-50/30 custom-scrollbar flex flex-col">
              {selectedLead.type === 'comment' && selectedLead.source && (
                 <div className="mb-8 p-6 bg-white rounded-[24px] border border-neutral-200 flex items-center justify-between">
                    <div>
                       <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1">评论来源</span>
                       <h4 className="text-[15px] font-black text-neutral-900">{selectedLead.source}</h4>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl text-neutral-500"><BookOpen size={20} /></div>
                 </div>
              )}

              <div className="flex gap-4">
                  <img src={selectedLead.avatar} className="w-10 h-10 rounded-full shrink-0 border border-neutral-200" alt="" />
                  <div className="flex flex-col gap-2 max-w-[70%]">
                    <div className="bg-white p-5 rounded-[24px] rounded-tl-none border border-neutral-200 shadow-sm">
                        <p className="text-[14px] font-bold text-neutral-800 leading-relaxed">
                          {selectedLead.content}
                        </p>
                    </div>
                    <div className="text-[10px] font-black text-neutral-400 ml-2">{selectedLead.time}</div>
                  </div>
              </div>
            </div>

            {selectedLead.type === 'dm' && (
              <div className="p-6 border-t border-neutral-100 bg-white">
                <div className="flex justify-between items-center mb-4">
                   <div className="flex gap-2">
                       <button className="px-4 py-1.5 bg-neutral-900 text-white text-[11px] font-black rounded-lg flex items-center gap-1.5 hover:opacity-90">
                         <Bot size={14} /> AI 辅助回复
                       </button>
                       <button className="px-4 py-1.5 bg-neutral-100 text-neutral-600 text-[11px] font-black rounded-lg hover:bg-neutral-200">
                         提取联系方式
                       </button>
                   </div>
                   <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${aiAutoReply ? 'bg-emerald-500' : 'bg-neutral-200'}`} onClick={() => setAiAutoReply(!aiAutoReply)}>
                         <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${aiAutoReply ? 'left-4' : 'left-1'}`} />
                      </div>
                      <span className="text-[11px] font-black text-neutral-500 group-hover:text-neutral-900">AI 自动接待与引流</span>
                   </label>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-[24px] p-2 focus-within:border-primary-500 focus-within:bg-white transition-all">
                  <textarea 
                    className="w-full bg-transparent border-none outline-none p-4 text-[14px] font-bold text-neutral-900 placeholder:text-neutral-400 resize-none min-h-[100px]"
                    placeholder="输入回复内容，或按 Tab 接受 AI 建议..."
                  />
                  <div className="flex justify-end pr-2 pb-2">
                    <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl flex items-center gap-2 hover:bg-primary-500 transition-all font-black text-[13px]">
                        发送 <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {selectedLead.type === 'comment' && (
              <div className="p-10 border-t border-neutral-100 bg-white flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-400 mb-4">
                    <MessageCircle size={24} />
                 </div>
                 <h4 className="text-[14px] font-black text-neutral-900 mb-2">评论涉及平台风控，请在原生平台处理</h4>
                 <p className="text-[12px] text-neutral-400 font-bold mb-6 max-w-sm">AI 已根据上下文生成此评论互动的高转化回复建议，请点击右上角的「跳转至笔记处理」完成控评与引流。</p>
                 <div className="w-full max-w-lg p-5 bg-orange-50 border border-orange-100 rounded-2xl text-left">
                    <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Bot size={12}/> AI 推荐回复</div>
                    <p className="text-[13px] font-bold text-neutral-800">
                       “亲亲，这件确实很适合肉肉女孩呢！穿上巨显瘦～不过因为我们近期在做活动，小爆了一下，库存有点紧。私信发您领取专属福利哦！👗”
                    </p>
                 </div>
              </div>
            )}
          </div>
        ) : activeTab === 'sop' ? (
          <div className="flex-1 bg-[#fafafa] flex items-center justify-center">
             <div className="text-center text-neutral-400">
                <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-[14px] font-black">请在左侧选择 SOP 文档进行查看与编辑</p>
             </div>
          </div>
        ) : (
          <div className="flex-1 bg-white" />
        )}
      </div>
    </div>
  );
};

