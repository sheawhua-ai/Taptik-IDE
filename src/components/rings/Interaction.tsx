import React, { useState } from 'react';
import { 
 Search, Filter, MessageSquare, Flame, CheckCircle2, 
 Clock, User, Send, ExternalLink, MoreVertical, 
 ChevronDown, AlertCircle, TrendingUp, ShieldAlert, Zap,
 MessageCircle, Smartphone, UserPlus, BookOpen, Bot,
 Inbox, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InboxItem {
 id: string;
 title: string;
 description: string;
 type: 'comment' | 'dm';
 time: string;
 status: 'pending' | 'resolved';
 source: string;
 urgency: 'high' | 'medium';
 snapshots?: string[];
 aiSuggestion?: string;
 userPrompt?: string;
}

const MOCK_INBOX: InboxItem[] = [
 {
 id: '1',
 title: '高热度负面评论识别',
 description: '识别到笔记《第一次买，避坑指南》下出现热点评论。建议立即通过 AI 话术进行安抚回复，避免负面舆情发酵。',
 type: 'comment',
 urgency: 'high',
 time: '5分钟前',
 status: 'pending',
 source: '小红书评论区监控',
 snapshots: ['“这是我第三次买了，这次的包装真的太敷衍了，瓶子都瘪了，太失望了直接粉转黑。”'],
 aiSuggestion: '“亲爱的老朋友，真的非常抱歉给您带来这么糟糕的体验！作为我们最珍视的连续支持我们的客户，这种失误是绝对不被允许的。我们已为您安排了无门槛的换新补偿，并附赠了一份新品体验装。稍后会有专属客服与您对接，一定会给您一个满意的答复！”'
 },
 {
 id: '2',
 title: '高潜意向私信会话',
 description: '捕捉到带明确购买意图且询问「合作/加盟」的私信，联系方式已提炼。AI 判断意向极高，建议快速跟进。',
 type: 'dm',
 urgency: 'high',
 time: '20分钟前',
 status: 'pending',
 source: '全域私信收件箱',
 userPrompt: '“请问如果在二线城市开线下店，有区域代理保护吗？我的微信号是 wx_827364，能否发一份详细的资料？”'
 },
 {
 id: '3',
 title: '常规种草互动评论',
 description: '笔记《氛围感拉满的百搭单品》下有用户询问价格与链接。AI已准备好引导私信与发券的回复模版。',
 type: 'comment',
 urgency: 'medium',
 time: '1小时前',
 status: 'pending',
 source: '小红书评论区监控',
 snapshots: ['“哇这个颜色也太好看了吧，求个链接和价格，谢谢拔草！”'],
 aiSuggestion: '“宝宝眼光真好！这款是我们这期的爆款，现在刚好有活动真的很划算～🔗链接在主页店铺或者私信发您哦，还可以叠加专属满减券，不要错过啦！”'
 }
];

export const Interaction: React.FC<{ hasData?: boolean }> = ({ hasData = true }) => {
 const [filter, setFilter] = useState<'all' | 'comment' | 'dm'>('all');
 const [selectedTask, setSelectedTask] = useState<InboxItem | null>(hasData ? MOCK_INBOX[0] : null);
 const [isCRMTransferred, setIsCRMTransferred] = useState(false);

 const filteredInbox = MOCK_INBOX.filter(item => {
 if (filter === 'all') return true;
 return item.type === filter;
 });

 if (!hasData) {
 return (
 <div className="flex h-full w-full bg-white overflow-hidden items-center justify-center">
 <div className="max-w-md w-full p-12 bg-white rounded-[64px] border border-neutral-100 shadow-2xl shadow-neutral-200/50 flex flex-col items-center text-center">
 <div className="w-24 h-24 bg-rose-50 rounded-[32px] flex items-center justify-center text-rose-500 mb-10 group hover:rotate-12 transition-transform">
 <Flame size={48} className="fill-current" />
 </div>
 <h3 className="text-2xl font-semibold text-neutral-900 mb-4 italic tracking-tight">客资与工单已上线</h3>
 <p className="text-[14px] text-neutral-400 leading-relaxed mb-10">
 全天候监控矩阵账号的私信与评论，由 AI 自动捕捉高意向客资与公关风险，生成统一待办工单。
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
 <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">客资与工单中心</h2>
 <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1.5">
 <ShieldAlert size={12} className="text-rose-500"/> AI 24小时值群 · 异常过滤
 </p>
 </div>
 </div>
 </div>

 <div className="px-6 py-4 bg-white border-b border-neutral-100">
 <div className="flex gap-2 bg-neutral-50 p-1.5 rounded-xl">
 {[
 { id: 'all', name: '全部提醒' },
 { id: 'comment', name: '评论监控识别' },
 { id: 'dm', name: '全域私信会话' }
 ].map((btn) => (
 <button 
 key={btn.id}
 onClick={() => setFilter(btn.id as any)}
 className={`flex-1 py-1.5 rounded-lg text-[11px] transition-all ${filter === btn.id ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
 >
 {btn.name}
 </button>
 ))}
 </div>
 </div>
 
 <div className="flex-1 overflow-y-auto custom-scrollbar">
 <div className="p-4 space-y-3">
 {filteredInbox.map(item => (
 <button 
 key={item.id}
 onClick={() => {
 setSelectedTask(item);
 setIsCRMTransferred(false);
 }}
 className={`w-full text-left p-5 rounded-[24px] transition-all border relative ${selectedTask?.id === item.id ? 'bg-white border-primary-500 shadow-xl shadow-primary-500/10 z-10' : 'bg-white border-neutral-100 hover:border-neutral-200'}`}
 >
 {item.urgency === 'high' && (
 <div className="absolute top-5 right-5 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
 <AlertTriangle size={12} className="text-red-500" />
 <span className="text-[10px] text-red-500">紧急跟进</span>
 </div>
 )}
 <div className="flex items-center gap-3 mb-3 pr-16">
 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white shadow-sm ${item.type === 'comment' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
 {item.type === 'comment' ? <MessageCircle size={20} /> : <MessageSquare size={20} />}
 </div>
 <div>
 <div className="text-[14px] text-neutral-900 leading-tight mb-1">{item.title}</div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] text-neutral-400 capitalize">{item.source}</span>
 </div>
 </div>
 </div>
 <p className="text-[13px] text-neutral-600 mb-3 line-clamp-2 leading-relaxed">
 {item.description}
 </p>
 <div className="flex items-center justify-between pt-3 border-t border-neutral-50">
 <span className="text-[10px] text-neutral-400 uppercase tracking-widest">{item.time}</span>
 <span className={`text-[11px] ${item.status === 'pending' ? 'text-blue-500' : 'text-emerald-500'}`}>
 {item.status === 'pending' ? '等待人工处理' : '已解决'}
 </span>
 </div>
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* 主工作区 */}
 <div className="flex-1 flex overflow-hidden">
 {selectedTask ? (
 <div className="flex-1 flex flex-col bg-white">
 <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white">
 <div className="flex items-center gap-4">
 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-neutral-100 shadow-sm ${selectedTask.type === 'comment' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
 {selectedTask.type === 'comment' ? <MessageCircle size={24} /> : <MessageSquare size={24} />}
 </div>
 <div>
 <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight mb-1">{selectedTask.title}</h3>
 <div className="flex items-center gap-2">
 <span className="text-[11px] text-neutral-400">来自: {selectedTask.source}</span>
 </div>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <button className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[12px] flex items-center gap-2 hover:bg-neutral-800 shadow-xl shadow-neutral-200">
 标记为已处理 <CheckCircle2 size={14}/>
 </button>
 <button className="p-2 bg-neutral-50 text-neutral-400 rounded-xl hover:bg-neutral-100 border border-neutral-100">
 <MoreVertical size={18}/>
 </button>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto p-12 bg-neutral-50/30 custom-scrollbar flex flex-col items-center">
 
 <div className="w-full max-w-4xl border border-neutral-200 bg-white rounded-[32px] p-8 shadow-md relative overflow-hidden">
 
 <div className="flex items-center gap-4 mb-8 pb-6 border-b border-neutral-100">
 <Bot size={24} className="text-primary-500" />
 <div>
 <h4 className="text-[15px] font-semibold text-neutral-900 mb-1">AI 诊断分析</h4>
 <p className="text-[12px] text-neutral-500">{selectedTask.description}</p>
 </div>
 </div>

 {selectedTask.type === 'comment' && (
 <div className="space-y-6">
 <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4 relative">
 <MessageCircle size={20} className="text-blue-500 shrink-0" />
 <div className="flex-1">
 <h5 className="text-[13px] font-semibold text-blue-900 mb-2">识别到的高权重互动评论：</h5>
 {selectedTask.snapshots?.map((snap, idx) => (
 <p key={idx} className="text-[13px] text-blue-900/80 mb-3 bg-white p-3 rounded-lg border border-blue-100 shadow-sm">{snap}</p>
 ))}
 </div>
 </div>
 
 <div>
 <h5 className="text-[13px] font-semibold text-neutral-900 mb-3 flex items-center gap-2"><Bot size={16} className="text-primary-500"/> AI推荐回复话术 (已通过合规过滤)</h5>
 <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-2xl">
 <p className="text-[13px] font-medium text-neutral-700 leading-relaxed">{selectedTask.aiSuggestion}</p>
 </div>
 <div className="mt-6 flex justify-end gap-3">
 <button className="px-6 py-2 bg-white text-neutral-600 border border-neutral-200 rounded-xl text-[12px] hover:bg-neutral-50">
 复制并前往平台回复
 </button>
 <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-[12px] flex items-center gap-2 hover:bg-primary-500 shadow-xl shadow-neutral-200/50">
 一键执行回复操作 <Send size={14}/>
 </button>
 </div>
 </div>
 </div>
 )}

 {selectedTask.type === 'dm' && (
 <div className="space-y-6">
 <div className="p-6 bg-[#fafafa] border border-neutral-100 rounded-3xl relative">
 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fafafa] pointer-events-none" />
 <h5 className="text-[13px] font-semibold text-neutral-900 mb-4 flex items-center gap-2"><Smartphone size={16} className="text-purple-500"/> 最新私信存档内容</h5>
 
 <div className="flex gap-4 mb-4 justify-end">
 <div className="max-w-[70%] bg-white p-4 rounded-2xl rounded-tr-sm border border-neutral-100 shadow-sm">
 <p className="text-[13px] text-neutral-800 leading-relaxed font-medium">{selectedTask.userPrompt}</p>
 <span className="text-[10px] text-neutral-400 mt-2 block opacity-50">来源于 品牌IP小红书号</span>
 </div>
 <div className="w-8 h-8 bg-neutral-200 rounded-full shrink-0" />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4 mt-4">
 <div className="p-5 border border-purple-100 bg-purple-50/50 rounded-2xl">
 <h6 className="text-[11px] font-semibold text-purple-900 uppercase tracking-widest mb-1">意向等级与诉求拆解</h6>
 <div className="flex items-center gap-2 mt-2">
 <div className="flex items-center justify-center bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-[10px] ">加盟咨询</div>
 <div className="flex items-center justify-center bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-[10px] ">意向极高</div>
 </div>
 </div>
 <div className="p-5 border border-purple-100 bg-purple-50/50 rounded-2xl">
 <h6 className="text-[11px] font-semibold text-purple-900 uppercase tracking-widest mb-1">已提取的关键客资</h6>
 <div className="mt-2 text-[13px] text-neutral-900">
 <span className="text-neutral-500">微信号:</span> wx_827364
 </div>
 </div>
 </div>

 <div className="flex justify-end pt-4">
 <button 
 onClick={() => setIsCRMTransferred(true)}
 disabled={isCRMTransferred}
 className={`px-8 py-3 rounded-xl text-[13px] flex items-center gap-2 transition-all shadow-xl ${isCRMTransferred ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-[#008CEE] text-white hover:bg-[#0077CC] shadow-[#008CEE]/20'}`}
 >
 {isCRMTransferred ? (
 <>
 <CheckCircle2 size={16} /> 已推送到企微全员群
 </>
 ) : (
 <>
 <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
 <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.42 16.58L11 12.17V7H12.5V11.54L16.36 15.4L15.42 16.58Z"/>
 </svg>
 一键将线索分配至商务团队 (企微)
 </>
 )}
 </button>
 </div>
 </div>
 )}
 </div>

 </div>
 </div>
 ) : (
 <div className="flex-1 bg-white" />
 )}
 </div>
 </div>
 );
};



