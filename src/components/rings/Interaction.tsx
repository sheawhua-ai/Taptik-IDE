import React, { useState } from 'react';
import { 
  Search, Filter, MessageSquare, Flame, CheckCircle2, 
  Clock, User, Send, ExternalLink, MoreVertical, 
  ChevronDown, AlertCircle, TrendingUp, ShieldAlert, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Comment {
  id: string;
  user: string;
  content: string;
  noteTitle: string;
  time: string;
  intent: 'high' | 'question' | 'other';
  intentScore: number;
  status: 'pending' | 'replied' | 'ignored';
  avatar?: string;
  accountType: 'professional' | 'amateur';
  accountName: string;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    user: '小丸子爱旅行',
    content: '太美了！怎么预订？6月还有房吗？',
    noteTitle: '《推开窗的那一刻，我知道这980花得太值了》',
    time: '2分钟前',
    intent: 'high',
    intentScore: 98,
    status: 'pending',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    accountType: 'professional',
    accountName: '瑞吉官方'
  },
  {
    id: '2',
    user: '旅行达人Leo',
    content: '有亲子房吗？能加床吗？',
    noteTitle: '《青岛住宿避坑！淡季980住瑞吉不香吗》',
    time: '15分钟前',
    intent: 'question',
    intentScore: 75,
    status: 'pending',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    accountType: 'amateur',
    accountName: '素人-小王'
  }
];

export const Interaction: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'high' | 'question'>('all');
  const [selectedComment, setSelectedComment] = useState<Comment | null>(MOCK_COMMENTS[0]);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Universal Header Status Bar */}
      <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
              <ShieldAlert size={24} />
           </div>
           <div>
              <h2 className="text-[17px] font-black text-neutral-900 tracking-tight">触达变现 & CRM 中心</h2>
              <p className="text-[11px] font-bold text-neutral-400">CRM Agent: 自动捕捉高净值线索并匹配矩阵账号回复</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <Zap size={12} className="fill-current"/>
              LEAD PROTECTION: ACTIVE
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* List Area - Standardized 480px */}
        <div className="w-[480px] border-r border-neutral-100 flex flex-col h-full bg-neutral-50/20 overflow-hidden">
          <div className="p-10 border-b border-neutral-100 bg-white/50">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-[14px] font-black text-neutral-900 flex items-center gap-2 uppercase tracking-widest">
                   <MessageSquare size={16} className="text-neutral-400"/> 意向线索漏斗
                </h3>
             </div>
             
             <div className="flex gap-2 bg-neutral-100 p-1.5 rounded-[20px]">
               {[
                 { id: 'all', name: '全部漏斗' },
                 { id: 'high', name: '高意向' },
                 { id: 'question', name: '咨询' }
               ].map((btn) => (
                 <button 
                   key={btn.id}
                   onClick={() => setFilter(btn.id as any)}
                   className={`flex-1 py-2.5 rounded-xl text-[12px] font-black transition-all ${filter === btn.id ? 'bg-white text-neutral-900 shadow-sm border border-neutral-100' : 'text-neutral-400 hover:text-neutral-600'}`}
                 >
                   {btn.name}
                 </button>
               ))}
             </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
            {MOCK_COMMENTS.filter(c => filter === 'all' || c.intent === filter).map(comment => (
              <button 
                key={comment.id}
                onClick={() => setSelectedComment(comment)}
                className={`w-full text-left p-8 rounded-[36px] transition-all border group relative ${selectedComment?.id === comment.id ? 'bg-white border-primary-500 shadow-2xl shadow-primary-500/10' : 'bg-white border-transparent hover:border-neutral-200 hover:bg-white/80'}`}
              >
                {comment.intent === 'high' && (
                   <div className="absolute top-8 right-8 flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-lg">
                      <Flame size={12} className="text-rose-500 animate-pulse" />
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">HOT LEAD</span>
                   </div>
                )}
                <div className="flex items-center gap-4 mb-6">
                  <img src={comment.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="" />
                  <div>
                    <div className="text-[15px] font-black text-neutral-900">{comment.user}</div>
                    <div className="text-[11px] font-bold text-neutral-400 italic">来自: {comment.accountName}</div>
                  </div>
                </div>
                <p className="text-[14px] font-bold text-neutral-700 mb-6 leading-relaxed">
                  {comment.content}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-neutral-50">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${comment.accountType === 'professional' ? 'bg-blue-50 text-blue-500' : 'bg-neutral-100 text-neutral-500'}`}>
                       {comment.accountType === 'professional' ? '专业号' : '矩阵号'}
                    </span>
                    <div className="flex items-center gap-2">
                       <span className="text-[11px] font-black text-neutral-900">{comment.intentScore}%</span>
                       <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className={`h-full ${comment.intentScore > 80 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${comment.intentScore}%` }} />
                       </div>
                    </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Canvas */}
        <div className="flex-1 flex flex-col bg-neutral-50/10 overflow-hidden">
        {selectedComment ? (
          <>
            <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white shadow-sm z-10">
              <div className="flex items-center gap-4">
                <img src={selectedComment.avatar} className="w-11 h-11 rounded-full border-2 border-neutral-100" alt="" />
                <div>
                   <h3 className="text-[16px] font-black text-neutral-900 tracking-tight">{selectedComment.user}</h3>
                   <div className="flex items-center gap-2">
                      <p className="text-[11px] font-bold text-neutral-400">UID: {selectedComment.id} • 小红书全域变现漏斗</p>
                      <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">ACTIVE SESSION</span>
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 bg-neutral-900 text-white rounded-2xl text-[13px] font-black shadow-xl shadow-neutral-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                   <TrendingUp size={16}/> 推送至销售线索
                </button>
                <button className="p-2.5 bg-neutral-50 text-neutral-400 rounded-2xl hover:bg-neutral-100 transition-all border border-neutral-100">
                   <MoreVertical size={20}/>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 bg-neutral-50/10 custom-scrollbar space-y-12">
               <div className="p-8 bg-white rounded-[40px] border border-neutral-100 flex items-start gap-8 shadow-sm">
                <div className="w-32 h-44 bg-neutral-100 rounded-2xl overflow-hidden shrink-0 group relative cursor-pointer shadow-inner">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-all" />
                   <div className="w-full h-full bg-blue-500 flex items-center justify-center font-black text-white p-4 text-center leading-tight">
                      笔记缩略图
                   </div>
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-2 mb-3">
                     <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black border border-blue-100 uppercase tracking-widest">爆款笔记</span>
                     <span className="text-[11px] font-bold text-neutral-400 italic">2026.04.12 发布</span>
                  </div>
                  <h4 className="text-2xl font-black text-neutral-900 tracking-tight leading-tight mb-4 max-w-xl">
                    {selectedComment.noteTitle}
                  </h4>
                  <div className="grid grid-cols-3 gap-8">
                    {[
                       { label: '笔记点击', val: '4.2w', color: 'text-neutral-900' },
                       { label: '互动总量', val: '1,203', color: 'text-neutral-900' },
                       { label: '变现转化', val: '12%', color: 'text-success-500' }
                    ].map((stat, i) => (
                       <div key={i} className="flex flex-col">
                          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</span>
                          <span className={`text-2xl font-black ${stat.color} tracking-tighter`}>{stat.val}</span>
                       </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="max-w-2xl mx-auto space-y-8">
                 <div className="flex gap-5">
                    <img src={selectedComment.avatar} className="w-10 h-10 rounded-full shrink-0 border-2 border-white shadow-sm" alt="" />
                    <div className="flex flex-col gap-3">
                       <div className="bg-white p-8 rounded-[40px] rounded-tl-none shadow-xl shadow-neutral-100 border border-neutral-100">
                          <p className="text-[16px] font-bold text-neutral-800 leading-relaxed italic">
                             “ {selectedComment.content} ”
                          </p>
                       </div>
                       <div className="flex items-center gap-3 pl-2">
                          <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">{selectedComment.time}</span>
                          <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                          <span className="text-[11px] font-black text-orange-500">意向得分: {selectedComment.intentScore}</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-10 border-t border-neutral-100 bg-white">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex gap-2">
                    <button className="px-4 py-2 bg-neutral-900 text-white text-[12px] font-black rounded-xl hover:bg-primary-500 transition-all flex items-center gap-2">
                       <Zap size={14} className="fill-current"/> 话术 Agent 生成建议
                    </button>
                    <button className="px-4 py-2 bg-neutral-50 text-neutral-500 text-[12px] font-black rounded-xl hover:bg-neutral-100 transition-all border border-neutral-100">矩阵协同中心</button>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black text-neutral-900 uppercase tracking-widest">TAPTIK: CONVERSION ENGINE ONLINE</span>
                 </div>
              </div>
              <div className="relative">
                <div className="bg-neutral-50 border border-neutral-200 rounded-[40px] focus-within:bg-white focus-within:border-primary-500 focus-within:shadow-2xl focus-within:shadow-primary-500/10 transition-all p-3">
                  <textarea 
                    className="w-full bg-transparent border-none outline-none p-6 text-[15px] font-bold text-neutral-900 placeholder:text-neutral-400 resize-none min-h-[140px]"
                    placeholder="输入更具变现吸引力的回复内容..."
                  />
                  <div className="flex items-center justify-between px-6 pb-4">
                     <p className="text-[11px] font-bold text-neutral-400 italic">当前账户余额：矩阵号A1 (素人号)</p>
                     <button className="h-14 px-10 bg-neutral-900 text-white rounded-[24px] flex items-center justify-center gap-2 hover:bg-primary-500 hover:scale-[1.02] active:scale-95 transition-all shadow-xl font-black text-[15px]">
                        确认发送回复 <Send size={18} />
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-300 p-8 text-center bg-neutral-50/20">
             <div className="w-24 h-24 bg-white rounded-[40px] shadow-sm flex items-center justify-center mb-8 border border-neutral-100">
                <MessageSquare size={36} className="text-neutral-200" />
             </div>
             <h3 className="text-xl font-black text-neutral-900 tracking-tight leading-tight">请选择一条评论线索</h3>
             <p className="text-neutral-400 font-bold mt-2 max-w-xs leading-relaxed uppercase text-[11px] tracking-widest">Agent 正在全天候捕捉高净值客户咨询</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

const HelpCircleIcon = (props: any) => <div {...props} className="w-4 h-4 rounded-full border-2 border-currentColor flex items-center justify-center text-[10px]">?</div>;
