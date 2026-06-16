import React, { useState } from 'react';
import { 
  Users, CheckCircle2, ArrowRight, ScanLine, AlertCircle, 
  Send, User, Link, MessageSquare, LayoutGrid
} from 'lucide-react';
import { motion } from 'motion/react';

export const ContentProduction: React.FC<{ hasData?: boolean }> = ({ hasData = true }) => {
  const [viewMode, setViewMode] = useState<'accounts' | 'distribution'>('accounts');

  const MOCK_OWNED_ACCOUNTS = [
    { id: 'a1', name: '奈雪-区域福利官', type: '企业专业号', platform: '小红书', status: '正常登录', followers: '12.4w', quota: '5篇/天', taskTodo: 12, taskDone: 15, health: 'good' },
    { id: 'a2', name: '周末喝点啥', type: 'KOS 员工号', platform: '小红书', status: '正常登录', followers: '3,200', quota: '3篇/天', taskTodo: 5, taskDone: 28, health: 'good' },
    { id: 'a3', name: '阿喵测评', type: 'KOS 员工号', platform: '小红书', status: '登录失效', followers: '840', quota: '1篇/天', taskTodo: 8, taskDone: 8, health: 'error' },
    { id: 'a4', name: '广州吃喝小分队', type: 'KOS 员工号', platform: '小红书', status: '限流提醒', followers: '1.2w', quota: '1篇/天', taskTodo: 1, taskDone: 12, health: 'warning' },
  ];

  const MOCK_KOC_ACCOUNTS = [
    { id: 'k1', name: '小甜甜爱打卡', source: '真实探店客户', handler: '张小帅', wechat: '已绑定', url: 'https://xiaohongshu.com/...', monitoring: '夏季打卡活动', status: '已收录', data: '阅读 840 · 赞藏 42', lastPost: '2小时前' },
    { id: 'k2', name: '吃货大本营', source: '兼职派单群', handler: '李经理', wechat: '群联络', url: 'https://xiaohongshu.com/...', monitoring: '夏季打卡活动', status: '无相关笔记', data: '-', lastPost: '1天前' },
  ];

  return (
    <div className="flex flex-col h-full bg-neutral-50/50 overflow-hidden">
      {/* Header */}
      <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
               <ShareIcon size={24} />
            </div>
            <div>
               <h2 className="text-[17px] font-black text-neutral-900 tracking-tight">账号与分发</h2>
               <p className="text-[11px] font-bold text-neutral-400 mt-0.5">管理自有资产矩阵，并将生成的素材下发至各渠道账号发布</p>
            </div>
         </div>
         <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setViewMode('accounts')}
              className={`px-5 py-2.5 rounded-xl text-[12px] font-black transition-all ${viewMode === 'accounts' ? 'bg-white shadow-xl text-neutral-900 border border-neutral-200/50' : 'text-neutral-400'}`}
            >账号池管理</button>
            <button 
              onClick={() => setViewMode('distribution')}
              className={`px-5 py-2.5 rounded-xl text-[12px] font-black transition-all ${viewMode === 'distribution' ? 'bg-white shadow-xl text-neutral-900 border border-neutral-200/50' : 'text-neutral-400'}`}
            >待分发素材队列</button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-8 lg:p-12 max-w-6xl mx-auto">
        {viewMode === 'accounts' ? (
          <div className="space-y-12">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-neutral-900">自有资产与 KOS 员工号库</h3>
                <span className="text-[11px] font-bold text-neutral-400 bg-primary-50 text-primary-500 border border-primary-100 px-3 py-1 rounded-full uppercase tracking-widest">完全掌控授权态</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {MOCK_OWNED_ACCOUNTS.map(account => (
                  <div key={account.id} className="p-5 bg-white border border-neutral-100 rounded-[24px] flex flex-col hover:border-primary-500/30 hover:shadow-xl transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${account.health === 'good' ? 'bg-primary-50 text-primary-500' : account.health === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'}`}>
                            {account.health === 'error' ? <AlertCircle size={20} /> : <User size={20} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="text-[15px] font-black text-neutral-900">{account.name}</h4>
                              <span className="px-1.5 py-0.5 rounded border border-neutral-200 text-[9px] font-black text-neutral-400">{account.platform}</span>
                            </div>
                            <p className="text-[11px] text-neutral-400 font-bold tracking-wide flex items-center gap-2">
                               {account.type} <span className="w-1 h-1 rounded-full bg-neutral-200"></span> 粉丝 {account.followers}
                            </p>
                          </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${account.health === 'good' ? 'bg-success-50 text-success-600' : account.health === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-500'}`}>
                          {account.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-neutral-50/50 p-3 rounded-2xl border border-neutral-100 mt-2">
                        <div className="flex-1">
                          <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mb-0.5">待执行发布</p>
                          <p className={`text-[14px] font-black ${account.taskTodo > 0 ? 'text-primary-500' : 'text-neutral-900'}`}>{account.taskTodo} 篇</p>
                        </div>
                        <div className="w-px h-8 bg-neutral-200"></div>
                        <div className="flex-1">
                          <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mb-0.5">配额</p>
                          <p className="text-[14px] font-black text-neutral-900">{account.quota}</p>
                        </div>
                        <div className="w-px h-8 bg-neutral-200"></div>
                        <div className="flex-1">
                          <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mb-0.5">累计分发</p>
                          <p className="text-[14px] font-black text-neutral-900">{account.taskDone} 篇</p>
                        </div>
                        <button className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-900 flex items-center justify-center text-white hover:bg-primary-500 hover:border-primary-500 transition-all shadow-md">
                          <Send size={16} />
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-neutral-900">外部合作与素人 KOC 监控池</h3>
                <span className="text-[11px] font-bold text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full uppercase tracking-widest">爬虫公开态监控</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {MOCK_KOC_ACCOUNTS.map(koc => (
                  <div key={koc.id} className="p-5 bg-white border border-neutral-100 border-dashed rounded-[24px] flex flex-col md:flex-row items-start md:items-center justify-between hover:border-neutral-300 hover:shadow-lg transition-all group opacity-80 hover:opacity-100 gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400 font-black shrink-0 relative">
                          <ScanLine size={20} />
                          {koc.status.includes('限流') && <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></div>}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <h4 className="text-[15px] font-black text-neutral-900">{koc.name}</h4>
                             <a href="#" className="text-neutral-300 hover:text-blue-500 transition-colors"><Link size={12} /></a>
                          </div>
                          <p className="text-[10px] text-neutral-500 font-bold tracking-widest flex items-center gap-1.5 break-all">
                             <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600">{koc.source}</span>
                             <span>对接人: {koc.handler}</span>
                             {koc.wechat === '已绑定' ? <span className="text-emerald-500 flex items-center gap-0.5"><MessageSquare size={10} /> 已添微</span> : <span className="text-neutral-400">{koc.wechat}</span>}
                          </p>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="w-24 h-24 bg-white border border-neutral-200 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                <LayoutGrid size={32} className="text-neutral-300" />
             </div>
             <h3 className="text-xl font-black text-neutral-900">分发队列暂无数据</h3>
             <p className="text-[13px] font-bold text-neutral-400 mt-2">请先在「项目与内容」中完成笔记生成，再由系统推送到此列队</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

const ShareIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);


