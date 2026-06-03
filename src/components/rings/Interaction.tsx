import React, { useState } from 'react';
import { 
  Search, Filter, MessageSquare, Flame, CheckCircle2, 
  Clock, User, Send, ExternalLink, MoreVertical, 
  ChevronDown, AlertCircle, TrendingUp, ShieldAlert
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
    <div className="flex h-full bg-white overflow-hidden">
      {/* List Area */}
      <div className="w-[450px] border-r border-neutral-100 flex flex-col h-full bg-neutral-50/30">
        <div className="p-6 border-b border-neutral-100 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">触达转化中心</h2>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100 uppercase tracking-wider">4 待处理</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {[
              { id: 'all', name: '全部', icon: MessageSquare },
              { id: 'high', name: '高意向', icon: Flame, color: 'text-orange-500' },
              { id: 'question', name: '咨询', icon: HelpCircleIcon }
            ].map((btn) => (
              <button 
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[12px] font-black transition-all border ${filter === btn.id ? 'bg-neutral-900 text-white border-neutral-900 shadow-lg' : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300'}`}
              >
                {btn.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-3 space-y-2">
            {MOCK_COMMENTS.filter(c => filter === 'all' || c.intent === filter).map(comment => (
              <button 
                key={comment.id}
                onClick={() => setSelectedComment(comment)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedComment?.id === comment.id ? 'bg-white border-primary-500 shadow-xl shadow-primary-500/5' : 'bg-white/50 border-neutral-100 hover:border-neutral-200 hover:bg-white'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <img src={comment.avatar} className="w-8 h-8 rounded-full bg-neutral-100" alt="" />
                    <div>
                      <div className="text-[13px] font-black text-neutral-900">{comment.user}</div>
                      <div className="text-[10px] font-bold text-neutral-400">{comment.time}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[9px] font-black border flex items-center gap-1 ${comment.accountType === 'professional' ? 'bg-blue-50 text-blue-500 border-blue-100' : 'bg-neutral-50 text-neutral-400 border-neutral-100'}`}>
                    {comment.accountType === 'professional' ? '专业号' : '素人号'}
                  </div>
                </div>
                <p className="text-[14px] font-bold text-neutral-700 mb-3 line-clamp-2 leading-relaxed">
                  {comment.content}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-neutral-50">
                   <div className="flex items-center gap-1.5 font-bold text-[10px] text-neutral-400">
                      归属：{comment.accountName}
                   </div>
                   <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{comment.intentScore}% Intent</span>
                   </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {selectedComment ? (
          <>
            <div className="h-16 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <img src={selectedComment.avatar} className="w-9 h-9 rounded-full bg-neutral-100" alt="" />
                <div>
                   <h3 className="text-[15px] font-black text-neutral-900 tracking-tight">{selectedComment.user}</h3>
                   <p className="text-[11px] font-bold text-neutral-400">UID: 82910421 • 通过 {selectedComment.accountName} 触达</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {selectedComment.accountType === 'professional' && (
                  <button className="px-4 py-2 bg-primary-500 text-white rounded-xl text-[12px] font-black shadow-lg shadow-primary-500/20 hover:scale-105 transition-all flex items-center gap-2">
                     <Send size={14}/> 发起私信
                  </button>
                )}
                {selectedComment.accountType === 'amateur' && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 text-neutral-400 rounded-xl text-[11px] font-bold border border-neutral-100">
                     <ShieldAlert size={14}/> 素人号仅限评论回复
                  </div>
                )}
                <button className="p-2 hover:bg-neutral-50 rounded-xl transition-all text-neutral-400">
                   <MoreVertical size={18}/>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
               <div className="p-6 bg-neutral-50 rounded-3xl border border-neutral-100 flex items-start gap-6">
                <div className="w-24 h-32 bg-neutral-200 rounded-xl overflow-hidden shrink-0 shadow-sm border border-neutral-100">
                   <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center p-4">
                      <p className="text-[8px] font-black text-white leading-tight uppercase opacity-50 tracking-widest text-center">Note</p>
                   </div>
                </div>
                <div className="flex-1 pt-2">
                  <h4 className="text-[15px] font-black text-neutral-900 tracking-tight leading-tight mb-2">
                    {selectedComment.noteTitle}
                  </h4>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">互动</span>
                      <span className="text-xl font-black text-neutral-900 tracking-tighter">1.2w+</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="flex gap-4">
                    <img src={selectedComment.avatar} className="w-8 h-8 rounded-full shrink-0" alt="" />
                    <div className="flex flex-col gap-2">
                       <div className="bg-neutral-100 p-4 rounded-2xl rounded-tl-none max-w-md">
                          <p className="text-[14px] font-bold text-neutral-800 leading-relaxed">{selectedComment.content}</p>
                       </div>
                       <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{selectedComment.time}</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-8 border-t border-neutral-100 bg-neutral-0">
              <div className="mb-4 flex gap-2">
                 <button className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 text-[11px] font-black rounded-lg transition-all border border-neutral-100">💬 回复评论</button>
                 <button className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 text-[11px] font-black rounded-lg transition-all border border-neutral-100">💡 引导留资</button>
              </div>
              <div className="relative group">
                <div className="relative flex bg-neutral-50 border border-neutral-200 rounded-[24px] overflow-hidden focus-within:bg-white focus-within:border-primary-500 transition-all p-2">
                  <textarea 
                    className="flex-1 bg-transparent border-none outline-none p-4 text-[14px] font-bold text-neutral-900 placeholder:text-neutral-400 resize-none min-h-[100px]"
                    placeholder={selectedComment.accountType === 'professional' ? "输入私信或评论回复内容..." : "输入评论回复内容..."}
                  />
                  <div className="flex flex-col justify-end p-2 gap-2">
                    <button className="w-10 h-10 bg-primary-500 text-white rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-primary-500/20">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-300 p-8 text-center">
             <div className="w-20 h-20 bg-neutral-50 rounded-[32px] flex items-center justify-center mb-6">
                <MessageSquare size={32} />
             </div>
             <p className="text-[14px] font-black tracking-tight uppercase">请选择一条评论开始触达</p>
          </div>
        )}
      </div>
    </div>
  );
};

const HelpCircleIcon = (props: any) => <div {...props} className="w-4 h-4 rounded-full border-2 border-currentColor flex items-center justify-center text-[10px]">?</div>;
