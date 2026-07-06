import React, { useState } from 'react';
import { ContentDetailDrawer } from '../components/rings/ContentDetailDrawer';
import { PublishDrawer } from '../components/rings/PublishDrawer';
import { ChannelsDrawer } from '../components/rings/ChannelsDrawer';
import { 
  PlusCircle, Target, Check, ArrowRight, Camera, Plus, Send,
  Image as ImageIcon, Sparkles, X, LayoutGrid, ArrowLeft, Wand2,
  AlertTriangle, CheckCircle2, ChevronRight, MessageSquare, Play,
  ListTodo, ChevronDown, ChevronUp, Layers, Activity, FileText, CheckCircle,
  Kanban, List, AlignJustify, Compass, BarChart2, MessageCircle, GitCommit, GitPullRequest, Search,
  User, Clock, UploadCloud, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_PROJECTS = [
  {
    id: 'p1',
    name: '美妆搜索种草战役',
    goal: '搜索卡位 + 私域承接',
    currentDirection: '抗老 / 紧致 / 敏感肌 / 成分科普',
    channels: '官方 3 / KOS 4 / 泛素人分发 8 / 真实客户快发 5',
    nodes: [
      { id: 'strategy', name: '策略', status: '已确认', type: 'success', tab: 'strategy', actionDesc: '进入操盘建议模块' },
      { id: 'channels', name: '账号组合', status: '已拆分', type: 'success', tab: 'channels', actionDesc: '查看通道拆分' },
      { id: 'content', name: '内容确认', status: '待确认', type: 'pending', tab: 'content', actionDesc: '按通道查看与确认' },
      { id: 'material', name: '素材/体验', status: '缺8', type: 'warning', tab: 'interaction', actionDesc: '素材与体验进度' },
      { id: 'publish', name: '发布执行', status: '待排期', type: 'pending', tab: 'publish', actionDesc: '发布包详情与分发' },
      { id: 'interaction', name: '互动线索', status: '待产生', type: 'pending', tab: 'interaction', actionDesc: '待发布后产生' },
      { id: 'sales', name: '私域转化', status: '待线索', type: 'pending', tab: 'interaction', actionDesc: '待线索进入' },
      { id: 'metrics', name: '复盘', status: '待回收', type: 'pending', tab: 'metrics', actionDesc: '待数据回收' },
    ],
    issue: '真实客户 5 个名额未扫码，泛素人 8 个需预设人设，KOS 2 个账号待定',
    recommendation: '先铺门店台卡码 -> 预设泛素人人设 -> 审官方号内容',
    owner: '运营小王',
    deadline: '今日 18:00'
  },
  {
    id: 'p2',
    name: '幼犬换粮避坑搜索卡位',
    goal: '自然流起量 + 转化',
    currentDirection: '避坑 / 挑食 / 软便 / 专业科普',
    channels: '官方 5 / KOS 10 / 真实客户 30',
    nodes: [
      { id: 'strategy', name: '策略', status: '已确认', type: 'success', tab: 'strategy', actionDesc: '进入操盘建议模块' },
      { id: 'channels', name: '账号组合', status: '已确认', type: 'success', tab: 'channels', actionDesc: '查看通道拆分' },
      { id: 'content', name: '内容确认', status: '已确认', type: 'success', tab: 'content', actionDesc: '按通道查看与确认' },
      { id: 'material', name: '素材/体验', status: '全齐', type: 'success', tab: 'interaction', actionDesc: '素材齐备' },
      { id: 'publish', name: '发布执行', status: '已发42', type: 'success', tab: 'publish', actionDesc: '发布包详情与分发' },
      { id: 'interaction', name: '互动线索', status: '高意向41', type: 'warning', tab: 'interaction', actionDesc: '快速处理高意向线索' },
      { id: 'sales', name: '私域转化', status: '待跟进12', type: 'warning', tab: 'interaction', actionDesc: '处理私域承接动作' },
      { id: 'metrics', name: '复盘', status: '数据佳', type: 'success', tab: 'metrics', actionDesc: '查看复盘数据' },
    ],
    issue: '发现 41 条高意向待跟进线索',
    recommendation: '去私信承接 -> AI 快捷回复',
    owner: '客服小李',
    deadline: '明日 12:00'
  }
];

export default function MerchantMatrix() {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<'add_batch' | 'materials' | 'interaction' | 'content_detail' | 'publish' | 'channels_detail' | null>(null);

  const handleNodeClick = (node: any) => {
    if (node.id === 'channels') {
      setActiveDrawer('channels_detail');
      return;
    }
    if (node.id === 'content') {
      setActiveDrawer('content_detail');
      return;
    }
    if (node.id === 'publish') {
      setActiveDrawer('publish');
      return;
    }
    if (node.id === 'interaction' && node.type === 'warning') {
      setActiveDrawer('interaction');
      return;
    }
    if (node.type === 'warning' || node.type === 'success') {
      window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: node.tab } }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50/50 w-full relative">
      <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h2 className="text-[17px] font-semibold text-neutral-900">商家运营流</h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">掌握各项目推进状态，优先处理影响发布和转化的事项。</p>
          </div>
        </div>
        <div>
          <button className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-xl text-[13px] font-bold shadow-md hover:bg-neutral-800 transition-colors">
            <Plus size={16} /> 新建项目流
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-4">
          
          {/* 画像缺失告警 */}
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle size={16} />
              </div>
              <div>
                <div className="text-[14px] font-bold text-rose-900 mb-0.5">商家画像缺 7 项信息，可能影响本轮内容判断和素材筛选</div>
                <div className="text-[12px] text-rose-700">缺失项会影响操盘建议完整度和私域话术风险，建议尽快补充，确保下游流转质量。</div>
              </div>
            </div>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-merchant-profile-drawer'))}
              className="text-[13px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              去补齐画像 <ChevronRight size={16} />
            </button>
          </div>

          {MOCK_PROJECTS.map(proj => (
            <div key={proj.id} className="bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
              <div className="flex flex-col p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[18px] font-bold text-neutral-900">{proj.name}</h3>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded text-[11px]">执行中</span>
                    </div>
                    <div className="text-[13px] text-neutral-500 flex items-center gap-3">
                      <span>主攻方向：<strong className="text-neutral-800">{proj.currentDirection}</strong></span>
                      <span className="w-1 h-1 rounded-full bg-neutral-300" />
                      <span>本轮目标：{proj.goal}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 mb-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                     <AlertTriangle size={14} className="text-amber-600" />
                     <span className="text-[13px] font-bold text-amber-900">{proj.issue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Sparkles size={14} className="text-indigo-500" />
                     <span className="text-[12px] font-medium text-indigo-700">推荐处理顺序：{proj.recommendation}</span>
                  </div>
                </div>

                {/* Nodes Flow */}
                <div className="relative mt-2">
                  <div className="absolute top-[18px] left-10 right-10 h-1 bg-neutral-100 rounded-full -z-10" />
                  
                  <div className="flex justify-between relative z-10 px-2">
                    {proj.nodes.map((node, idx) => (
                      <div key={node.id} className="flex flex-col items-center gap-3 group relative" onClick={() => handleNodeClick(node)}>
                        <div className={`text-[13px] font-bold transition-colors ${node.type === 'pending' ? 'text-neutral-400' : 'text-neutral-700 group-hover:text-indigo-600'}`}>{node.name}</div>
                        
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 shadow-sm transition-all bg-white relative overflow-hidden
                          ${node.type === 'success' ? 'border-emerald-500 text-emerald-600 cursor-pointer group-hover:border-emerald-600' : 
                            node.type === 'warning' ? 'border-amber-500 text-amber-600 ring-4 ring-amber-500/10 cursor-pointer' : 
                            'border-neutral-200 text-neutral-300 cursor-pointer hover:border-neutral-300 hover:text-neutral-500'}
                          ${node.type !== 'pending' ? 'group-hover:scale-105 group-active:scale-95' : ''}`}
                        >
                          <div className={`transition-opacity flex items-center justify-center w-full h-full ${node.type !== 'pending' ? 'group-hover:opacity-0' : ''}`}>
                            {node.type === 'success' && <CheckCircle2 size={20} />}
                            {node.type === 'warning' && <AlertTriangle size={20} />}
                            {node.type === 'pending' && <GitCommit size={20} />}
                          </div>
                          
                          {node.type !== 'pending' && (
                            <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${node.type === 'warning' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                              <ArrowRight size={16} className={node.type === 'warning' ? 'text-amber-600' : 'text-emerald-600'} />
                            </div>
                          )}
                        </div>
                        
                        <div className={`text-[12px] font-medium px-3 py-1 rounded-full border
                          ${node.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700 font-bold' : 
                            node.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-700 font-bold shadow-sm' : 
                            'bg-neutral-50 border-neutral-100 text-neutral-400'}
                        `}>
                          {node.status}
                        </div>

                        {/* Tooltip */}
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max max-w-[160px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                           <div className="bg-neutral-900 text-white text-[11px] font-medium px-3 py-2 rounded-lg text-center shadow-lg leading-relaxed">
                             {node.actionDesc}
                           </div>
                           <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[13px] text-neutral-500 font-medium">
                    <span className="flex items-center gap-1.5"><User size={14} className="text-neutral-400" /> 负责人：{proj.owner}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-neutral-400" /> 截止：{proj.deadline}</span>
                  </div>
                  <button className="flex items-center gap-1 text-[13px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                    进入详情 <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeDrawer === 'channels_detail' && <ChannelsDrawer onClose={() => setActiveDrawer(null)} />}
        {activeDrawer === 'content_detail' && <ContentDetailDrawer onClose={() => setActiveDrawer(null)} />}
        {activeDrawer === 'publish' && <PublishDrawer onClose={() => setActiveDrawer(null)} />}
        {activeDrawer === 'materials' && (
           <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setActiveDrawer(null)}>
             <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" />
             <motion.div
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="w-[500px] bg-white h-full shadow-2xl flex flex-col relative z-10"
               onClick={(e) => e.stopPropagation()}
             >
               <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                 <div className="flex items-center gap-2">
                   <Camera size={18} className="text-indigo-600" />
                   <h3 className="font-bold text-neutral-900 text-[16px]">素材执行任务 - 幼犬换粮</h3>
                 </div>
                 <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
                   <X size={18} className="text-neutral-500" />
                 </button>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-6">
                 
                 <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                   <Wand2 size={18} className="text-indigo-600 mt-0.5 shrink-0" />
                   <div>
                     <h4 className="text-[14px] font-bold text-indigo-900 mb-1">素材与体验进度</h4>
                     <p className="text-[12px] text-indigo-700 leading-relaxed">系统已将素材任务与体验引导分发至各个通道。建议按照推荐顺序处理阻碍节点。</p>
                   </div>
                 </div>

                 <div className="space-y-3">
                   <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                     <div className="flex items-center justify-between mb-2">
                       <h4 className="font-bold text-[14px] text-neutral-900 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-blue-500"></span> 内部补拍任务
                       </h4>
                       <span className="text-[12px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">2 个任务，1 个待回传</span>
                     </div>
                     <p className="text-[12px] text-neutral-500">要求：门店导购拍摄喂食互动场景，或产品特写图。</p>
                   </div>

                   <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                     <div className="flex items-center justify-between mb-2 pl-1">
                       <h4 className="font-bold text-[14px] text-neutral-900 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-amber-500"></span> 泛素人分发
                       </h4>
                       <span className="text-[12px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">8 个待领取，0 个已回传</span>
                     </div>
                     <p className="text-[12px] text-neutral-500 pl-1 mb-3">要求：领取试用装，体验 3 天后回传开箱图与便便状态。</p>
                     <div className="pl-1">
                       <button className="text-[12px] font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors px-4 py-2 rounded-lg flex items-center gap-1.5">
                         <Send size={14} /> 一键发送领取链接
                       </button>
                     </div>
                   </div>

                   <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                     <div className="flex items-center justify-between mb-2">
                       <h4 className="font-bold text-[14px] text-neutral-900 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 真实客户快发
                       </h4>
                       <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">5 个待邀请，2 个已回传</span>
                     </div>
                     <p className="text-[12px] text-neutral-500 mb-3">要求：回传真实反馈、好评与狗狗照片。</p>
                     <div>
                       <button className="text-[12px] font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors px-4 py-2 rounded-lg flex items-center gap-1.5">
                         <Send size={14} /> 再次发送邀请提醒
                       </button>
                     </div>
                   </div>
                 </div>

                 <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                   <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                   <div>
                     <h4 className="text-[14px] font-bold text-amber-900 mb-1">建议下一步</h4>
                     <p className="text-[12px] text-amber-700 leading-relaxed">由于泛素人分发 需要 3 天体验期，建议优先发送 <strong>泛素人分发 领取链接</strong> 以防项目延期。</p>
                   </div>
                 </div>

               </div>
             </motion.div>
           </div>
        )}
        {activeDrawer === 'interaction' && (
           <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setActiveDrawer(null)}>
             <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" />
             <motion.div
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="w-[500px] bg-white h-full shadow-2xl flex flex-col relative z-10"
               onClick={(e) => e.stopPropagation()}
             >
               <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                 <div className="flex items-center gap-2">
                   <MessageSquare size={18} className="text-indigo-600" />
                   <h3 className="font-bold text-neutral-900 text-[16px]">高意向线索处理 - 幼犬换粮</h3>
                 </div>
                 <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
                   <X size={18} className="text-neutral-500" />
                 </button>
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                   <AlertTriangle size={18} className="text-amber-600 mt-0.5" />
                   <div>
                     <h4 className="text-[14px] font-bold text-amber-900 mb-1">发现 41 条高意向待跟进线索</h4>
                     <p className="text-[12px] text-amber-700 leading-relaxed">系统已通过语义分析提取了近期“求推荐”、“怎么买”等高频评论与私信，建议批量接入转化流程。</p>
                   </div>
                 </div>

                 <div className="space-y-3">
                   {[1, 2, 3].map((_, i) => (
                     <div key={i} className="border border-neutral-200 rounded-xl p-4 flex gap-4 bg-white hover:border-neutral-300 transition-colors cursor-pointer group shadow-sm">
                       <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white shrink-0">
                         <User size={20} />
                       </div>
                       <div className="flex-1 flex flex-col justify-center">
                         <div className="flex items-center justify-between mb-1">
                           <h4 className="font-bold text-[14px] text-neutral-900">小红薯_用户{i+1}</h4>
                           <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">高意向</span>
                         </div>
                         <p className="text-[13px] text-neutral-700 mb-3 bg-neutral-50 p-2 rounded-lg">“我家法斗最近一直拉软便，换这个粮可以吗？”</p>
                         <div className="flex gap-2">
                           <button className="text-[12px] font-medium text-white bg-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors">
                             去私信承接
                           </button>
                           <button className="text-[12px] font-medium text-neutral-700 bg-neutral-100 px-3 py-1.5 rounded-lg hover:bg-neutral-200 transition-colors">
                             AI 快捷回复
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>

    </div>
  );
}
