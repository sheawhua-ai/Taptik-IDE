import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle, RefreshCw, MessageSquare, ShieldAlert, Search, CheckCircle2,
  AlertOctagon, ChevronRight, User, Sparkles, Link2, Image as ImageIcon, Clock,
  Check, X, FileText, AlertTriangle, Info, Send, Eye, CornerDownRight, MoreHorizontal,
  ListChecks, ExternalLink, Settings, Lightbulb, Zap, Database, Copy, MessageCircleQuestion, Lock
} from 'lucide-react';

export function InteractionWorkbench({ task, onClose }: { task?: any, onClose?: () => void }) {
  const [activeTab, setActiveTab] = useState<'private_msg' | 'comment' | 'intercept' | 'insight' | 'risk'>('private_msg');
  const [taskStatusView, setTaskStatusView] = useState<'pending' | 'verifying' | 'waiting_owner' | 'waiting_24h' | 'handled'>('pending');
  const [showRuleConfig, setShowRuleConfig] = useState(false);

  const STATUS_TABS = activeTab === 'intercept' ? [
    { id: 'pending', label: '待处理', count: 18 },
    { id: 'verifying', label: '待人工确认', count: 5 },
    { id: 'copied', label: '已复制待回复', count: 3 },
    { id: 'waiting_owner', label: '等待账号主', count: 2 },
    { id: 'handled', label: '今日已处理', count: 12 },
  ] : [
    { id: 'pending', label: '待处理', count: 12 },
    { id: 'verifying', label: '待核实', count: 3 },
    { id: 'waiting_24h', label: '24小时待跟进', count: 2 },
    { id: 'handled', label: '已处理', count: 0 },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-hover-bg flex flex-col h-screen overflow-hidden">
        <div className="bg-surface-1 border-b border-border-default px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <MessageCircle size={20} className="text-blue-600" />
                    <h2 className="text-[16px] font-bold text-text-main">互动承接中心</h2>
                </div>
                <div className="h-4 w-px bg-neutral-200 mx-2"></div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab('private_msg')} className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${activeTab === 'private_msg' ? 'bg-btn-main text-white' : 'text-text-secondary hover:bg-hover-bg'}`}>私信承接</button>
                    <button onClick={() => setActiveTab('comment')} className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${activeTab === 'comment' ? 'bg-btn-main text-white' : 'text-text-secondary hover:bg-hover-bg'}`}>评论处理</button>
                    <button onClick={() => setActiveTab('intercept')} className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${activeTab === 'intercept' ? 'bg-btn-main text-white' : 'text-text-secondary hover:bg-hover-bg'}`}>截流机会</button>
                    <button onClick={() => setActiveTab('insight')} className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${activeTab === 'insight' ? 'bg-btn-main text-white' : 'text-text-secondary hover:bg-hover-bg'}`}>评论洞察</button>
                    <button onClick={() => setActiveTab('risk')} className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${activeTab === 'risk' ? 'bg-rose-600 text-white' : 'text-text-secondary hover:bg-hover-bg'}`}>风险处理</button>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowRuleConfig(true)}
                  className="px-4 py-1.5 border border-border-default rounded-lg text-[13px] font-medium text-text-secondary hover:bg-page-bg flex items-center gap-2 transition-colors"
                >
                  <Settings size={14} />
                  承接规则配置
                </button>
                
                <button className="text-text-tertiary hover:text-text-main p-2 rounded-full hover:bg-hover-bg transition-colors flex items-center justify-center">
                    <RefreshCw size={18} />
                </button>
                <button onClick={onClose} className="text-text-tertiary hover:text-text-main p-1 rounded-full hover:bg-hover-bg transition-colors">
                    <X size={20} />
                </button>
            </div>
        </div>

        {activeTab !== 'insight' && (
            <div className="bg-surface-1 border-b border-border-default px-6 py-3 flex items-center shrink-0 gap-2">
                {STATUS_TABS.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setTaskStatusView(tab.id as any)}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                            taskStatusView === tab.id 
                            ? 'bg-hover-bg text-text-main font-bold' 
                            : 'text-text-tertiary hover:bg-page-bg'
                        }`}
                    >
                        {tab.label} {tab.count > 0 && <span className="ml-1 text-[13px] bg-neutral-200 px-1.5 rounded-full">{tab.count}</span>}
                    </button>
                ))}
            </div>
        )}

        <div className="flex-1 overflow-hidden relative">
            {activeTab === 'private_msg' && <PrivateMsgTab />}
            {activeTab === 'comment' && <CommentTab />}
            {activeTab === 'intercept' && <InterceptTab />}
            {activeTab === 'insight' && <InsightTab />}
            {activeTab === 'risk' && <RiskTab />}
        </div>
        
        <AnimatePresence>
          {showRuleConfig && <RuleConfigDrawer onClose={() => setShowRuleConfig(false)} />}
        </AnimatePresence>
    </div>
  );
}

function PrivateMsgTab() {
  const [factChecked, setFactChecked] = useState(false);

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left Column: List */}
      <div className="w-[320px] bg-surface-1 border-r border-border-default flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-4 space-y-3">
        <div className="p-3 bg-page-bg rounded-xl border border-primary-200 cursor-pointer shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[13px] font-bold text-text-main">用户7788</span>
            <span className="text-[13px] text-danger bg-rose-50 px-1.5 py-0.5 rounded font-bold">购买咨询 - 高意向</span>
          </div>
          <div className="text-[13px] text-text-secondary line-clamp-2 mb-2">你好，这款幼犬粮现在拍下什么时候能发货？送那个体验装吗？</div>
          <div className="flex items-center justify-between text-[13px] text-text-tertiary">
            <span className="flex items-center gap-1"><Clock size={12}/> 等待 5 分钟</span>
            <span>品牌主账号</span>
          </div>
        </div>
      </div>
      
      {/* Middle Column: Context */}
      <div className="flex-1 bg-[#fcfcfc] border-r border-border-default flex flex-col min-w-0">
        <div className="p-4 border-b border-border-default bg-surface-1">
          <h3 className="text-[14px] font-bold text-text-main mb-2">本次沟通上下文</h3>
          <div className="grid grid-cols-2 gap-2 text-[13px]">
            <div className="text-text-tertiary">接待账号: <span className="text-text-main">官方旗舰店</span></div>
            <div className="text-text-tertiary">关联产品: <span className="text-text-main">幼犬全价粮 2.5kg</span></div>
            <div className="col-span-2 text-text-tertiary">历史咨询: <span className="text-text-main">无</span> | 24小时跟进: <span className="text-text-main">未进行</span></div>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4 text-center text-[13px] text-text-tertiary">10:25 AM</div>
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-neutral-200 shrink-0"></div>
            <div className="bg-surface-1 border border-border-default p-3 rounded-xl rounded-tl-sm text-[13px] text-text-main max-w-[80%]">
              你好，这款幼犬粮现在拍下什么时候能发货？送那个体验装吗？
            </div>
          </div>
        </div>
        
        {/* User Lead Summary */}
        <div className="p-4 border-t border-border-default bg-surface-1 shrink-0">
          <div className="text-[13px] font-bold text-text-main mb-2 flex items-center gap-1.5"><User size={14}/> 用户线索摘要</div>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="text-[13px] text-text-tertiary mb-1">已确认信息</div>
              <div className="text-[13px] text-text-main">关注了品牌账号，浏览过幼犬系列产品</div>
            </div>
            <div className="flex-1">
              <div className="text-[13px] text-text-tertiary mb-1">AI推测信息</div>
              <div className="text-[13px] text-text-main">近期刚接幼犬回家，对发货时效敏感</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column: AI Action */}
      <div className="w-[380px] bg-surface-1 flex flex-col shrink-0">
        <div className="p-4 border-b border-border-default bg-page-bg">
           <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2"><Sparkles size={16} className="text-brand-logo"/> 意图判断与执行</h3>
        </div>
        <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-6">
           
           <div>
             <div className="text-[13px] font-bold text-text-main mb-1">意图识别: <span className="text-brand-logo">购买咨询</span></div>
             <div className="text-[13px] text-text-secondary border-l-2 border-primary-200 pl-2 italic">
               "什么时候能发货？送那个体验装吗？"
             </div>
           </div>

           <div className="p-4 border border-danger-light bg-rose-50 rounded-xl">
             <div className="flex items-center gap-1.5 text-[13px] font-bold text-danger mb-2">
               <Database size={14} /> 商家事实核验
             </div>
             {!factChecked ? (
                <>
                  <div className="text-[13px] text-danger mb-3 leading-relaxed">
                    商家资料中没有确认这项信息：<br/><strong>当前库房实际发货时效</strong> 及 <strong>体验装赠送政策</strong>。
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-surface-1 border border-danger-light text-danger rounded-lg text-[13px] font-bold hover:bg-danger-light">查看相关资料</button>
                    <button onClick={() => setFactChecked(true)} className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-[13px] font-bold hover:bg-rose-700">我已确认事实</button>
                  </div>
                </>
             ) : (
                <div className="text-[13px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 size={14} /> 事实已人工确认，允许生成承诺。
                </div>
             )}
           </div>

           <div>
             <div className="text-[13px] font-bold text-text-main mb-2">推荐动作与回复草稿</div>
             <div className="bg-page-bg border border-border-default p-3 rounded-xl text-[13px] text-text-secondary mb-2 relative min-h-[80px]">
                {factChecked ? "亲爱的家长您好！现在拍下48小时内发货哦，不仅会送体验装，确认收货后还可以联系我们领取试吃官专属小零食~" : "需要您先确认事实，才能生成回复内容。"}
             </div>
             <div className="flex gap-2 mb-4">
                <button className="flex items-center gap-1 px-2 py-1 bg-hover-bg text-text-secondary text-[13px] rounded hover:bg-selected-bg"><ImageIcon size={12}/> 插入图文</button>
                <button className="flex items-center gap-1 px-2 py-1 bg-hover-bg text-text-secondary text-[13px] rounded hover:bg-selected-bg"><Link2 size={12}/> 插入商品卡</button>
                <button className="flex items-center gap-1 px-2 py-1 bg-hover-bg text-text-tertiary text-[13px] rounded cursor-not-allowed" title="未开通私信通"><Lock size={12}/> 插入企微卡</button>
             </div>
           </div>

        </div>
        
        <div className="p-4 border-t border-border-default bg-surface-1 space-y-2 shrink-0">
           <button 
            disabled={!factChecked}
            className={`w-full py-2.5 rounded-xl text-[13px] font-bold transition-colors flex items-center justify-center gap-2 ${factChecked ? 'bg-btn-main text-white hover:bg-btn-main-hover' : 'bg-neutral-200 text-text-tertiary cursor-not-allowed'}`}
           >
             <Send size={16} /> 发送并处理下一条
           </button>
        </div>
      </div>
    </div>
  );
}

function CommentTab() {
  return (
    <div className="h-full flex flex-col bg-[#fcfcfc]">
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-2 text-amber-700 text-[13px] font-bold shrink-0">
         <Info size={16} />
         评论暂不支持系统直接回复，需复制内容后前往对应笔记处理。
      </div>
      <div className="flex-1 flex overflow-hidden">
        {/* Left */}
        <div className="w-[320px] bg-surface-1 border-r border-border-default overflow-y-auto p-4 space-y-4">
          <div>
            <div className="text-[13px] font-bold text-text-tertiary mb-2">品牌主账号 (2)</div>
            <div className="p-3 bg-page-bg rounded-xl border border-primary-200 cursor-pointer shadow-sm mb-2">
              <div className="text-[13px] font-bold text-text-main mb-1">《新手养犬必备指南》</div>
              <div className="text-[13px] text-text-secondary line-clamp-2">"马犬能吃这个吗？"</div>
            </div>
          </div>
          <div>
            <div className="text-[13px] font-bold text-text-tertiary mb-2">KOS/门店号 (1)</div>
            <div className="p-3 bg-surface-1 rounded-xl border border-border-default cursor-pointer hover:bg-page-bg transition-colors">
               <div className="text-[13px] font-bold text-text-main mb-1">《北京朝阳大悦城店周末打卡》</div>
               <div className="text-[13px] text-text-secondary">"店里现在有这款吗"</div>
            </div>
          </div>
        </div>
        
        {/* Middle */}
        <div className="flex-1 bg-[#fcfcfc] border-r border-border-default p-6 overflow-y-auto">
           <div className="max-w-2xl mx-auto">
             <div className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-sm mb-6">
                <div className="text-[13px] text-text-tertiary mb-1">原笔记摘要</div>
                <div className="text-[14px] font-bold text-text-main mb-2">新手养犬必备指南</div>
                <div className="text-[13px] text-text-secondary">整理了新手养犬常踩的坑，推荐了几款口碑好粮...</div>
             </div>
             
             <div className="space-y-4 relative">
                <div className="absolute left-4 top-4 bottom-4 w-px bg-neutral-200 z-0"></div>
                
                <div className="flex gap-3 relative z-10">
                   <div className="w-8 h-8 rounded-full bg-neutral-200 shrink-0 border-2 border-white"></div>
                   <div>
                      <div className="text-[13px] font-bold text-text-main mb-1">其他用户A</div>
                      <div className="text-[13px] text-text-secondary bg-surface-1 border border-border-default p-2.5 rounded-lg rounded-tl-sm shadow-sm">
                        这个品牌好像换包装了？
                      </div>
                   </div>
                </div>
                
                <div className="flex gap-3 relative z-10 pl-6">
                   <div className="w-8 h-8 rounded-full bg-primary-100 text-brand-logo flex items-center justify-center shrink-0 border-2 border-white">
                      <User size={14} />
                   </div>
                   <div>
                      <div className="text-[13px] font-bold text-primary-800 mb-1">官方旗舰店 (我们)</div>
                      <div className="text-[13px] text-text-secondary bg-surface-1 border border-border-default p-2.5 rounded-lg rounded-tl-sm shadow-sm">
                        是的呢，上个月全线升级了包装~
                      </div>
                   </div>
                </div>

                <div className="flex gap-3 relative z-10 pt-4">
                   <div className="w-8 h-8 rounded-full bg-neutral-200 shrink-0 border-2 border-white ring-2 ring-primary-200"></div>
                   <div>
                      <div className="text-[13px] font-bold text-text-main mb-1 flex items-center gap-2">
                        目标用户 <span className="text-[13px] bg-rose-100 text-danger px-1.5 rounded">待处理</span>
                      </div>
                      <div className="text-[13px] text-text-secondary bg-surface-1 border border-primary-200 p-3 rounded-lg rounded-tl-sm shadow-sm">
                        马犬能吃这个吗？我看颗粒好像有点小
                      </div>
                   </div>
                </div>
             </div>
           </div>
        </div>

        {/* Right */}
        <div className="w-[360px] bg-surface-1 flex flex-col shrink-0">
          <div className="p-4 border-b border-border-default bg-page-bg">
             <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2"><Sparkles size={16} className="text-brand-logo"/> 评论意图与草稿</h3>
          </div>
          <div className="flex-1 p-5 overflow-y-auto space-y-5">
             <div>
               <div className="text-[13px] font-bold text-text-tertiary mb-1">意图识别</div>
               <div className="text-[13px] font-bold text-text-main">产品适配度咨询（颗粒大小对大型犬的适用性）</div>
             </div>
             
             <div>
               <div className="text-[13px] font-bold text-text-tertiary mb-2">建议回复身份</div>
               <div className="text-[13px] font-bold text-primary-700 bg-brand-light px-3 py-1.5 rounded-lg inline-block border border-primary-100">官方旗舰店 (品牌号)</div>
             </div>
             
             <div>
               <div className="text-[13px] font-bold text-text-tertiary mb-2">回复草稿</div>
               <textarea 
                  className="w-full bg-page-bg border border-border-default rounded-xl p-3 text-[13px] text-text-main min-h-[120px] resize-none outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all"
                  defaultValue={"家长您好！这款是全犬种通用的，颗粒直径约8mm。对于马犬来说属于适中颗粒，有助于消化，完全可以放心喂食哦！"}
               />
             </div>
             
             <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-2">
                <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="text-[13px] text-amber-800 leading-relaxed">
                   请在小红书 App 中完成回复后，点击下方按钮标记状态。
                </div>
             </div>
          </div>
          <div className="p-4 border-t border-border-default bg-surface-1 shrink-0 space-y-2">
             <button className="w-full py-2.5 rounded-xl text-[13px] font-bold bg-btn-main text-white flex items-center justify-center gap-2 hover:bg-btn-main-hover transition-colors">
               <Copy size={16} /> 复制回复并打开原笔记
             </button>
             <div className="grid grid-cols-2 gap-2 mt-2">
               <button className="py-2 text-[13px] font-medium text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">已完成回复</button>
               <button className="py-2 text-[13px] font-medium text-text-secondary border border-border-default rounded-xl hover:bg-page-bg transition-colors">稍后处理</button>
             </div>
             <button className="w-full py-2 text-[13px] font-medium text-text-secondary border border-border-default rounded-xl hover:bg-page-bg transition-colors">
               通知账号主处理
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InterceptTab() {
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  return (
    <div className="h-full flex overflow-hidden relative">
      {/* Left */}
      <div className="w-[320px] bg-surface-1 border-r border-border-default overflow-y-auto p-4 space-y-4 custom-scrollbar">
         <div>
            <div className="text-[13px] font-bold text-text-tertiary mb-2">竞品笔记: 渴望双十一测评 (2)</div>
            <div className="p-3 bg-page-bg rounded-xl border border-primary-200 cursor-pointer shadow-sm mb-2">
              <div className="flex justify-between mb-1">
                 <span className="text-[13px] font-bold text-text-main">求推荐替代</span>
                 <span className="text-[13px] text-danger bg-rose-50 px-1.5 py-0.5 rounded font-bold">高需求</span>
              </div>
              <div className="text-[13px] text-text-secondary line-clamp-2">"渴望太贵了，有没有平替推荐？我家狗子肠胃也不太好。"</div>
              <div className="text-[13px] text-text-tertiary mt-2">10分钟前</div>
            </div>
         </div>
      </div>
      
      {/* Middle */}
      <div className="flex-1 bg-[#fcfcfc] border-r border-border-default p-6 overflow-y-auto">
         <div className="max-w-2xl mx-auto">
             <div className="bg-surface-1 p-4 rounded-xl border border-border-default shadow-sm mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-neutral-400"></div>
                <div className="flex items-center gap-2 text-[13px] text-text-tertiary mb-1">
                  <Database size={14} /> 竞品原笔记摘要
                </div>
                <div className="text-[14px] font-bold text-text-main mb-2">渴望双十一测评：到底要不要囤？</div>
             </div>
             
             <div className="flex gap-3 relative z-10 pt-4">
                 <div className="w-8 h-8 rounded-full bg-neutral-200 shrink-0 border-2 border-white ring-2 ring-primary-200"></div>
                 <div>
                    <div className="text-[13px] font-bold text-text-main mb-1 flex items-center gap-2">
                      目标评论
                    </div>
                    <div className="text-[13px] text-text-secondary bg-surface-1 border border-primary-200 p-3 rounded-lg rounded-tl-sm shadow-sm">
                      渴望太贵了，有没有平替推荐？我家狗子肠胃也不太好。
                    </div>
                 </div>
              </div>
         </div>
      </div>

      {/* Right */}
      <div className="w-[360px] bg-surface-1 flex flex-col shrink-0">
          <div className="p-4 border-b border-border-default bg-page-bg">
             <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2"><Lightbulb size={16} className="text-brand-logo"/> 截流建议</h3>
          </div>
          <div className="flex-1 p-5 overflow-y-auto space-y-5 custom-scrollbar">
             <div>
               <div className="text-[13px] font-bold text-text-tertiary mb-1">用户明确需求</div>
               <div className="text-[13px] font-bold text-text-main">寻找价格更低、且对敏感肠胃友好的狗粮。</div>
             </div>
             <div>
               <div className="text-[13px] font-bold text-text-tertiary mb-1">为什么适合介入？</div>
               <div className="text-[13px] text-text-secondary">用户表达了明确的品牌转移倾向，且提出了具体的痛点（价格+肠胃）。</div>
             </div>
             <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
               <div className="text-[13px] font-bold text-emerald-800 mb-1 flex items-center gap-1"><CheckCircle2 size={14}/> 商家产品匹配依据</div>
               <div className="text-[13px] text-emerald-700 leading-relaxed">我方产品单价为竞品 60%，且主打益生菌护肠配方，高度匹配。</div>
             </div>
             
             <div>
               <div className="text-[13px] font-bold text-text-tertiary mb-2">建议承接账号</div>
               <select className="w-full border border-border-default rounded-xl px-3 py-2.5 text-[13px] font-medium bg-page-bg outline-none hover:border-neutral-300 transition-colors cursor-pointer">
                 <option>KOS 营养师小李 (推荐)</option>
                 <option>客服-狗狗关怀号</option>
               </select>
             </div>
             
             <div>
               <div className="text-[13px] font-bold text-text-tertiary mb-2">回复草稿</div>
               <textarea 
                  className="w-full bg-page-bg border border-border-default rounded-xl p-3 text-[13px] text-text-main min-h-[100px] resize-none outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all"
                  defaultValue={"同肠胃不好的狗子！可以看看XX（咱们品牌），性价比很高，里面加了益生菌，我家换了这个之后就不软便了，可以先弄点试吃装试试。"}
               />
               <div className="bg-rose-50 p-2 rounded-lg text-[13px] text-danger mt-2 flex items-start gap-1.5 leading-relaxed">
                 <ShieldAlert size={14} className="shrink-0"/> 禁止伪造使用经历，请根据KOS人设调整语气。
               </div>
             </div>
          </div>
          <div className="p-4 border-t border-border-default bg-surface-1 shrink-0 space-y-2">
             <button className="w-full py-2.5 rounded-xl text-[13px] font-bold bg-btn-main text-white flex items-center justify-center gap-2 hover:bg-btn-main-hover transition-colors">
               <Copy size={16} /> 复制回复并打开原笔记
             </button>
             <button 
               onClick={() => setShowAssignPopup(true)}
               className="w-full py-2.5 rounded-xl text-[13px] font-bold bg-brand-light text-brand-logo flex items-center justify-center gap-2 hover:bg-primary-100 transition-colors border border-primary-100"
             >
               <User size={16} /> 派给员工处理
             </button>
             <div className="grid grid-cols-2 gap-2 mt-1">
               <button className="py-2 text-[13px] font-medium text-text-secondary border border-border-default bg-page-bg rounded-xl hover:bg-hover-bg transition-colors">标记已回复</button>
               <button className="py-2 text-[13px] font-medium text-text-secondary border border-border-default bg-page-bg rounded-xl hover:bg-hover-bg transition-colors">不适合承接</button>
             </div>
             <button className="w-full py-2 text-[13px] font-medium text-brand-logo hover:text-primary-700 transition-colors">
               转为内容机会
             </button>
          </div>
      </div>

      <AnimatePresence>
        {showAssignPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-btn-main/20 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-surface-1 rounded-xl shadow-2xl p-6 w-[360px] border border-border-default"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-[16px] font-bold text-text-main">派发承接任务</h3>
                <button onClick={() => setShowAssignPopup(false)} className="text-text-tertiary hover:text-text-secondary"><X size={18}/></button>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[13px] font-bold text-text-secondary mb-1.5">选择执行员工</label>
                  <select className="w-full border border-border-default rounded-xl px-3 py-2.5 text-[13px] outline-none hover:border-neutral-300">
                    <option>张三 (客服组)</option>
                    <option>李四 (运营组)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-text-secondary mb-1.5">指定承接账号</label>
                  <select className="w-full border border-border-default rounded-xl px-3 py-2.5 text-[13px] outline-none hover:border-neutral-300">
                    <option>KOS 营养师小李</option>
                    <option>客服-狗狗关怀号</option>
                  </select>
                </div>
              </div>
              <div className="bg-page-bg p-3 rounded-xl border border-border-default mb-6">
                <div className="text-[13px] text-text-tertiary mb-2">生成任务链接</div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-surface-1 border border-border-default rounded-lg px-3 py-2 text-[13px] text-text-tertiary truncate">
                    https://ais.studio/task/x8f2a...
                  </div>
                  <button className="px-3 py-2 bg-btn-main text-white rounded-lg text-[13px] font-bold hover:bg-btn-main-hover shrink-0">
                    复制
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setShowAssignPopup(false)}
                className="w-full py-2.5 bg-hover-bg text-text-secondary rounded-xl text-[13px] font-bold hover:bg-selected-bg transition-colors"
              >
                完成
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InsightTab() {
  return (
    <div className="h-full bg-[#fcfcfc] overflow-y-auto p-8 custom-scrollbar">
       <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-surface-1 p-6 rounded-xl border border-border-default shadow-sm mb-6 flex items-start justify-between">
             <div>
                <h2 className="text-[18px] font-bold text-text-main mb-2 flex items-center gap-2">
                   <Zap size={20} className="text-brand-logo" />
                   竞品"渴望"评论区洞察
                </h2>
                <div className="text-[13px] text-text-tertiary flex items-center gap-2">
                   <span>关键词: 求平替, 贵, 肠胃</span>
                   <span className="text-neutral-300">|</span>
                   <span>近7天内</span>
                   <span className="text-neutral-300">|</span>
                   <span>450条样本</span>
                </div>
             </div>
             <div className="text-[13px] font-medium text-text-tertiary bg-hover-bg border border-border-default px-3 py-1.5 rounded-lg flex items-center gap-1.5">
               <Clock size={12}/> 最后更新: 10分钟前
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
             {/* Left Col */}
             <div className="space-y-6">
                <div className="bg-surface-1 p-6 rounded-xl border border-border-default shadow-sm">
                   <h3 className="text-[15px] font-bold text-text-main mb-5 flex items-center gap-2">高频痛点 & 购买阻力</h3>
                   <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[13px] font-bold text-danger">价格过高/双十一优惠力度小</span>
                          <span className="text-[13px] font-medium text-text-tertiary">42%</span>
                        </div>
                        <div className="w-full bg-hover-bg h-1.5 rounded-full overflow-hidden"><div className="bg-rose-500 h-full w-[42%]"></div></div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[13px] font-bold text-danger">新批次软便/拉稀</span>
                          <span className="text-[13px] font-medium text-text-tertiary">28%</span>
                        </div>
                        <div className="w-full bg-hover-bg h-1.5 rounded-full overflow-hidden"><div className="bg-rose-500 h-full w-[28%]"></div></div>
                      </div>
                   </div>
                   <button className="mt-5 text-[13px] text-brand-logo font-bold flex items-center gap-1 hover:text-primary-700 transition-colors">
                     <Eye size={14}/> 查看这 189 条评论样本
                   </button>
                </div>
                
                <div className="bg-surface-1 p-6 rounded-xl border border-border-default shadow-sm">
                   <h3 className="text-[15px] font-bold text-text-main mb-4 flex items-center gap-2">新需求信号</h3>
                   <div className="p-4 bg-brand-light border border-primary-100 rounded-xl mb-4">
                     <div className="text-[13px] font-bold text-primary-900 mb-1">寻找低脂减肥粮</div>
                     <div className="text-[13px] text-primary-700 leading-relaxed">用户开始关注高蛋白带来的肥胖问题，有 15 条评论明确询问是否有低脂版本。</div>
                   </div>
                   <button className="text-[13px] text-brand-logo font-bold flex items-center gap-1 hover:text-primary-700 transition-colors">
                     <Eye size={14}/> 查看这 15 条评论样本
                   </button>
                </div>
             </div>
             
             {/* Right Col */}
             <div className="space-y-6">
                <div className="bg-surface-1 p-6 rounded-xl border border-border-default shadow-sm">
                   <h3 className="text-[15px] font-bold text-text-main mb-4 flex items-center gap-2">典型用户原话</h3>
                   <div className="space-y-3">
                      <div className="p-4 bg-page-bg rounded-xl border border-border-default text-[13px] text-text-secondary italic leading-relaxed">
                        "双十一比平时还贵，本来想囤半年的，现在直接劝退，有没有平替啊家人们？"
                      </div>
                      <div className="p-4 bg-page-bg rounded-xl border border-border-default text-[13px] text-text-secondary italic leading-relaxed">
                        "三个月小狗吃这个颗粒是不是太大了？感觉它嚼得很费劲。"
                      </div>
                   </div>
                </div>
                
                <div className="bg-surface-1 p-6 rounded-xl border border-border-default shadow-sm">
                   <h3 className="text-[15px] font-bold text-text-main mb-4 flex items-center gap-2">操作建议</h3>
                   <div className="space-y-3">
                     <button className="w-full py-2.5 px-4 text-left border border-border-default rounded-xl text-[13px] font-bold text-text-secondary hover:bg-page-bg hover:border-neutral-300 transition-all flex justify-between items-center group">
                       存为待确认商家记忆
                       <ChevronRight size={16} className="text-text-tertiary group-hover:text-text-secondary" />
                     </button>
                     <button className="w-full py-2.5 px-4 text-left border border-border-default rounded-xl text-[13px] font-bold text-text-secondary hover:bg-page-bg hover:border-neutral-300 transition-all flex justify-between items-center group">
                       生成话术补充建议 (针对软便)
                       <ChevronRight size={16} className="text-text-tertiary group-hover:text-text-secondary" />
                     </button>
                     <button className="w-full py-2.5 px-4 text-left border border-border-default rounded-xl text-[13px] font-bold text-text-secondary hover:bg-page-bg hover:border-neutral-300 transition-all flex justify-between items-center group">
                       生成内容方向
                       <ChevronRight size={16} className="text-text-tertiary group-hover:text-text-secondary" />
                     </button>
                     <button className="w-full py-2.5 px-4 text-left border border-border-default rounded-xl text-[13px] font-bold text-text-secondary hover:bg-page-bg hover:border-neutral-300 transition-all flex justify-between items-center group">
                       加入截流观察
                       <ChevronRight size={16} className="text-text-tertiary group-hover:text-text-secondary" />
                     </button>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

function RiskTab() {
  return (
    <div className="h-full flex overflow-hidden">
      {/* Left */}
      <div className="w-[320px] bg-surface-1 border-r border-border-default flex flex-col shrink-0 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <div className="p-3 bg-rose-50 rounded-xl border border-danger-light cursor-pointer shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-rose-500 text-white text-[13px] font-bold px-2 py-0.5 rounded-bl">高危/扩散中</div>
          <div className="flex justify-between items-start mb-2 pr-12">
            <span className="text-[13px] font-bold text-text-main">疑似产品致敏</span>
          </div>
          <div className="text-[13px] text-text-secondary line-clamp-2 mb-3">吃了你们家新批次的粮，狗狗疯狂抓挠，起红疹了，必须给我个说法！！</div>
          <div className="flex items-center justify-between text-[13px] font-medium text-text-tertiary">
             <span>小红书官方号评论</span>
             <span>15分钟前</span>
          </div>
        </div>
      </div>
      
      {/* Middle */}
      <div className="flex-1 bg-[#fcfcfc] border-r border-border-default flex flex-col min-w-0">
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
           <h3 className="text-[16px] font-bold text-text-main mb-6">风险上下文</h3>
           <div className="bg-surface-1 p-5 rounded-xl border border-border-default shadow-sm mb-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <User size={20} className="text-danger"/>
                </div>
                <div>
                   <div className="text-[14px] font-bold text-text-main mb-2">用户：暴躁的萨摩耶</div>
                   <div className="text-[13px] text-text-main bg-rose-50 p-4 rounded-xl border border-danger-light leading-relaxed">
                     吃了你们家新批次的粮，狗狗疯狂抓挠，起红疹了，必须给我个说法！！
                   </div>
                </div>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-1 p-5 rounded-xl border border-border-default shadow-sm">
                <div className="text-[13px] font-bold text-text-tertiary mb-1.5 flex items-center gap-1.5"><FileText size={14}/> 关联笔记 / 账号</div>
                <div className="text-[13px] font-bold text-text-main">《双十一囤粮必看》 / 官方旗舰店</div>
              </div>
              <div className="bg-surface-1 p-5 rounded-xl border border-border-default shadow-sm">
                <div className="text-[13px] font-bold text-text-tertiary mb-1.5 flex items-center gap-1.5"><Eye size={14}/> 扩散情况</div>
                <div className="text-[13px] font-bold text-danger">已有 5 人点赞该评论</div>
              </div>
           </div>
        </div>
      </div>

      {/* Right */}
      <div className="w-[420px] bg-surface-1 flex flex-col shrink-0">
         <div className="p-4 border-b border-border-default bg-rose-50 flex items-center gap-2">
            <ShieldAlert size={16} className="text-danger" />
            <h3 className="text-[14px] font-bold text-rose-900">风险处理路径</h3>
         </div>
         
         <div className="flex-1 p-6 overflow-y-auto space-y-8 relative custom-scrollbar">
            <div className="absolute left-[39px] top-6 bottom-6 w-px bg-neutral-200 z-0"></div>
            
            {/* Stage 1 */}
            <div className="relative z-10 flex gap-4">
               <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-[13px] shrink-0 shadow-sm">1</div>
               <div className="flex-1">
                  <div className="text-[14px] font-bold text-text-main mb-3 mt-1">公开回应 (安抚情绪)</div>
                  
                  <div className="bg-page-bg p-4 rounded-xl border border-border-default mb-3">
                     <div className="flex flex-wrap gap-2 mb-3">
                       <span className="text-[13px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-bold">已确认事实: 售后渠道畅通</span>
                       <span className="text-[13px] bg-neutral-200 text-text-secondary px-2 py-1 rounded-md font-bold">未知事实: 致敏原因</span>
                       <span className="text-[13px] bg-rose-100 text-danger px-2 py-1 rounded-md font-bold">禁止承诺: 退赔金额</span>
                     </div>
                     <div className="text-[13px] text-text-main leading-relaxed bg-surface-1 p-3 border border-border-default rounded-lg">
                        您好，看到您的反馈了，我们对狗狗的状况非常关心！麻烦您留意一下私信，我们会安排售后专员立刻帮您核实处理。
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="col-span-2 py-2.5 bg-btn-main text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-btn-main-hover transition-colors shadow-sm">
                      <Copy size={16}/> 复制回应并去原笔记回复
                    </button>
                    <button className="py-2 bg-surface-1 border border-border-default text-text-secondary rounded-xl text-[13px] font-bold hover:bg-page-bg transition-colors shadow-sm">
                      屏蔽此用户
                    </button>
                    <button className="py-2 bg-surface-1 border border-danger-light text-danger rounded-xl text-[13px] font-bold hover:bg-danger-light transition-colors shadow-sm">
                      向平台投诉
                    </button>
                  </div>
               </div>
            </div>

            {/* Stage 2 */}
            <div className="relative z-10 flex gap-4">
               <div className="w-8 h-8 rounded-full bg-primary-100 text-brand-logo flex items-center justify-center font-bold text-[13px] shrink-0 border-2 border-white shadow-sm">2</div>
               <div className="flex-1">
                  <div className="text-[14px] font-bold text-text-main mb-3 mt-1">引导私信 (收集信息)</div>
                  <div className="bg-page-bg p-4 rounded-xl border border-border-default mb-3">
                     <div className="text-[13px] text-text-main leading-relaxed bg-surface-1 p-3 border border-border-default rounded-lg">
                        家长您好！我是售后负责人。为了尽快核实情况并帮助狗狗，方便提供您的订单信息和狗狗目前发疹部位的照片吗？
                     </div>
                  </div>
                  <div className="text-[13px] text-danger mb-3 font-bold bg-rose-50 p-2 rounded-lg flex items-start gap-1.5 leading-relaxed border border-danger-light">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5"/> 需在私信中索要隐私信息，公开评论区禁止。
                  </div>
                  <button className="w-full py-2.5 bg-surface-1 border border-border-default text-text-secondary rounded-xl text-[13px] font-bold hover:bg-page-bg transition-colors shadow-sm">
                    生成私信草稿并通知账号主
                  </button>
               </div>
            </div>

            {/* Stage 3 */}
            <div className="relative z-10 flex gap-4 opacity-50">
               <div className="w-8 h-8 rounded-full bg-neutral-200 text-text-tertiary flex items-center justify-center font-bold text-[13px] shrink-0 border-2 border-white">3</div>
               <div className="flex-1">
                  <div className="text-[14px] font-bold text-text-main mb-1 mt-1">等待商家处理</div>
                  <div className="text-[13px] text-text-tertiary">等待用户回复私信后，转交客服。</div>
               </div>
            </div>
            
            {/* Stage 4 */}
            <div className="relative z-10 flex gap-4 opacity-50">
               <div className="w-8 h-8 rounded-full bg-neutral-200 text-text-tertiary flex items-center justify-center font-bold text-[13px] shrink-0 border-2 border-white">4</div>
               <div className="flex-1">
                  <div className="text-[14px] font-bold text-text-main mt-1">事项关闭</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function RuleConfigDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
       <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
         className="absolute inset-0 bg-btn-main/20 backdrop-blur-sm"
         onClick={onClose}
       />
       <motion.div
         initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
         transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
         className="w-[600px] h-full bg-[#fcfcfc] shadow-2xl relative z-10 flex flex-col"
       >
          <div className="px-6 py-5 border-b border-border-default flex items-center justify-between bg-surface-1 shrink-0">
             <div className="flex items-center gap-2">
               <Settings size={20} className="text-brand-logo" />
               <h3 className="font-bold text-text-main text-[18px]">承接规则配置</h3>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-hover-bg rounded-full transition-colors text-text-tertiary">
               <X size={20} />
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
             <RuleCard 
               title="高意向判断规则" 
               current="明确询问价格、购买方式、链接、门店、库存、预约、试用、适配问题，或在同一产品上连续追问。"
               suggestion="建议将点赞、普通夸赞和泛讨论排除在高意向之外。"
             />
             <RuleCard 
               title="企微引导准入" 
               current="仅针对带有“购买意向”且经过至少一轮有效问答的用户展示企微入口。"
             />
             <RuleCard 
               title="竞品主题与关键词" 
               current="监听“渴望”、“爱肯拿”等品牌的“求平替”、“拉稀”、“贵”等关键词。"
             />
             <RuleCard 
               title="截流账号范围" 
               current="仅允许使用 KOS 和 门店号 进行截流，禁用品牌主账号。"
             />
             <RuleCard 
               title="风险处理原则" 
               current="涉及产品安全、投诉、医疗化表达或舆情扩散时，必须人工审核发送，禁止AI自动回复。"
             />
          </div>
       </motion.div>
    </div>
  )
}

function RuleCard({ title, current, suggestion }: { title: string, current: string, suggestion?: string }) {
  return (
    <div className="bg-surface-1 border border-border-default rounded-xl p-5 shadow-sm">
      <h4 className="font-bold text-[14px] text-text-main mb-3">{title}</h4>
      <div className="bg-page-bg p-4 rounded-xl border border-border-default mb-4 text-[13px] text-text-secondary leading-relaxed">
        {current}
      </div>
      {suggestion && (
        <div className="text-[13px] text-brand-logo bg-brand-light p-3 rounded-xl mb-4 flex items-start gap-1.5 border border-primary-100/50">
          <Sparkles size={14} className="shrink-0 mt-0.5"/>
          {suggestion}
        </div>
      )}
      <div className="relative mt-2">
        <input 
          type="text" 
          placeholder="用一句话调整这个规则..." 
          className="w-full border border-border-default rounded-xl pl-4 pr-10 py-2.5 text-[13px] outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all bg-surface-1"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-logo hover:text-primary-700 p-1.5 rounded-lg hover:bg-brand-light transition-colors">
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
