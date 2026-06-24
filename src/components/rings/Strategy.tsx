import React, { useState } from 'react';
import { 
 Search, ShieldAlert, TrendingUp, BarChart, 
 MapPin, Globe, Compass, Info,
 AlertCircle, ArrowUpRight, Flame, Layers, Orbit, Sparkles, RefreshCw, Package, Calendar,
 Plus, Target, Play, CheckCircle2, Hash, CheckSquare, Square, BarChart2, Activity, Coins, Focus, Check, Bot
} from 'lucide-react';
import { motion } from 'motion/react';

export const Strategy: React.FC<{ hasData?: boolean; strategyData?: { word: string; rate: string }[] }> = ({ hasData = true, strategyData = [] }) => {
 const [selectedIndustry, setSelectedIndustry] = useState('宠物用品');
 const [isFetching, setIsFetching] = useState(false);
 const [fetchProgress, setFetchProgress] = useState(0);
 const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [projectTargetGroup, setProjectTargetGroup] = useState<'internal'|'external'>('internal');
  const [isCreating, setIsCreating] = useState(false);

 const toggleTopic = (id: number, title?: string) => {
 setSelectedTopic(prev => prev === id ? null : id);
 if (title && selectedTopic !== id) {
 window.dispatchEvent(new CustomEvent('open-expert', { detail: { expert: '策略推演指导', context: `我打算把这个重点选题作为接下来的打法，请你从策略角度做一次深度推演：${title}` }}));
 }
 };

 const INDUSTRIES = ['宠物用品', '美妆护肤', '户外运动', '家居百货', '母婴育儿'];

 const cacheMap: Record<string, { word: string; rate: string }[]> = {
 '宠物用品': [
 { word: '宠物零食高性价比挖掘', rate: '92' },
 { word: '幼犬换粮避坑指南', rate: '75' },
 { word: '国产平替猫粮测评', rate: '98' },
 ],
 '美妆护肤': [
 { word: '早C晚A入门必备', rate: '88' },
 { word: '大油皮控油粉底液', rate: '94' },
 { word: '敏感肌修复精华测评', rate: '82' },
 ]
 };

 const currentData = strategyData.length > 0 ? strategyData : (cacheMap[selectedIndustry] || []);

 const handleIndustryChange = (industry: string) => {
 setSelectedIndustry(industry);
 if (!cacheMap[industry]) {
 setIsFetching(true);
 setFetchProgress(0);
 const timer = setInterval(() => {
 setFetchProgress(prev => {
 if (prev >= 100) {
 clearInterval(timer);
 setIsFetching(false);
 return 100;
 }
 return prev + 5;
 });
 }, 100);
 }
 };

 const isEmpty = (!hasData && strategyData.length === 0) && !isFetching;

 return (
 <div className="flex flex-col h-full w-full bg-neutral-50/20 overflow-hidden">
 <div className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between shrink-0 bg-white z-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-neutral-900 text-white rounded-[20px] flex items-center justify-center shadow-md">
 <Compass size={24} className="animate-pulse" />
 </div>
 <div>
 <h2 className="text-[16px] font-semibold text-neutral-900 tracking-tight">选题与策略</h2>
 <div className="flex items-center gap-2 mt-0.5">
 <p className="text-[11px] text-neutral-400">洞察全网趋势热点，科学规划内容选题框架</p>
 </div>
 </div>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
 {isFetching ? (
 <div className="flex flex-col items-center justify-center h-full">
 <div className="w-32 h-32 relative flex items-center justify-center mb-8">
 <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
 <motion.div 
 className="absolute inset-0 border-4 border-primary-500 rounded-full" 
 style={{ clipPath: `inset(0 0 ${100 - fetchProgress}% 0)` }}
 />
 <RefreshCw className="text-primary-500 animate-spin" size={40} />
 </div>
 <h3 className="text-[16px] font-semibold text-neutral-900 mb-2">正在从全域与归因库抓取数据分析...</h3>
 <p className="text-neutral-400 text-[12px]">正在整合外部蓝海潜力词，并引入历史项目的 ROI 反馈...</p>
 </div>
 ) : isEmpty ? (
 <div className="flex-1 flex flex-col p-6 bg-white rounded-[24px] border border-neutral-100 shadow-sm relative overflow-hidden my-4 max-w-4xl mx-auto w-full">
 <div className="text-center mb-6">
 <div className="w-14 h-14 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
 <Compass size={28} />
 </div>
 <h3 className="text-[20px] font-semibold text-slate-900 mb-2 tracking-tight">小红书运营策略起点</h3>
 <p className="text-slate-500 text-[13px]">
 在为您生成全局内容策略与选题库之前，请先完善以下 3 个维度的前置信息。
 </p>
 </div>

 <div className="space-y-4 mb-8">
 {/* 维度 1 */}
 <div className="p-5 rounded-[20px] bg-neutral-50/50 border border-neutral-100">
 <div className="flex items-start gap-4">
 <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
 </div>
 <div className="flex-1">
 <h4 className="text-[14px] font-semibold text-slate-800">维度一：目标人群画像</h4>
 <p className="text-[12px] text-slate-400 mt-1 mb-2">面向谁？他们的主要痛点和检索场景是什么？</p>
 <textarea 
 className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-[13px] font-medium outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none shadow-sm placeholder:text-neutral-300"
 rows={2}
 placeholder="例如：20-30岁一二线城市女性，新手养猫，求平价好物..."
 />
 </div>
 </div>
 </div>

 {/* 维度 2 */}
 <div className="p-5 rounded-[20px] bg-neutral-50/50 border border-neutral-100">
 <div className="flex items-start gap-4">
 <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
 </div>
 <div className="flex-1">
 <h4 className="text-[14px] font-semibold text-slate-800">维度二：核心产品与卖点</h4>
 <p className="text-[12px] text-slate-400 mt-1 mb-2">卖什么？能提供什么差异化价值？</p>
 <textarea 
 className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-[13px] font-medium outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none shadow-sm placeholder:text-neutral-300"
 rows={2}
 placeholder="例如：主推无谷低敏烘焙粮，百元内平价天花板..."
 />
 </div>
 </div>
 </div>

 {/* 维度 3 */}
 <div className="p-5 rounded-[20px] bg-neutral-50/50 border border-neutral-100">
 <div className="flex items-start gap-4">
 <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
 </div>
 <div className="flex-1">
 <h4 className="text-[14px] font-semibold text-slate-800">维度三：对标竞品与行业特征</h4>
 <p className="text-[12px] text-slate-400 mt-1 mb-2">环境如何？想切走谁的蛋糕？</p>
 <textarea 
 className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-[13px] font-medium outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none shadow-sm placeholder:text-neutral-300"
 rows={2}
 placeholder="例如：对标某某猫粮，希望在干货科普抢占达人测评..."
 />
 </div>
 </div>
 </div>
 </div>

 <div className="flex justify-center mt-2">
 <button 
 onClick={() => window.dispatchEvent(new CustomEvent('nav-to-strategy-start'))}
 className="flex items-center justify-center gap-2 px-8 py-3.5 w-full sm:w-auto bg-neutral-900 text-white rounded-[16px] text-[14px] hover:bg-primary-500 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-neutral-200"
 >
 <Sparkles size={16}/> 基于上述信息启动策略分析
 </button>
 </div>
 </div>
 ) : (
 <div className="max-w-6xl mx-auto space-y-6">
 {/* Premium Custom Strategy Banner */}
 <div className="bg-gradient-to-r from-indigo-50/80 to-blue-50/50 rounded-[24px] border border-indigo-100 p-5 flex items-center justify-between shadow-[0_4px_24px_rgba(37,99,235,0.04)] relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/40 to-transparent pointer-events-none transform translate-x-32 group-hover:translate-x-0 transition-transform duration-1000" />
 <div className="flex items-center gap-4 relative z-10">
 <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
 <Bot size={22} className="animate-pulse" />
 </div>
 <div>
 <h3 className="text-[15px] font-semibold text-slate-800 mb-1">找不到满意的分析方向？</h3>
 <p className="text-[12px] text-slate-500 max-w-2xl leading-relaxed">
 作为尊享高阶商家，您可以直接下达专属的业务意图或特殊场景。策略大脑将为您重新调配深度计算资源，提取细颗粒度的专享数据，并进行定制化策略推演。
 </p>
 </div>
 </div>
 <button 
 onClick={() => setShowConfig(true)}
 className="shrink-0 px-6 py-3 bg-white border border-indigo-200 text-indigo-600 text-[13px] rounded-[16px] shadow-sm hover:shadow-lg hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all active:scale-95 flex items-center gap-2 relative z-10"
 >
 <Sparkles size={16} /> 沟通个性化并新建项目
 </button>
 </div>

 {/* Module 1: 找方向，看话题 */}
 <div className="bg-white rounded-[24px] border border-neutral-100 p-6 shadow-sm">
 <div className="flex items-center justify-between mb-5">
 <div>
 <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight flex items-center gap-2">
 <TrendingUp size={18} className="text-primary-500" />
 找方向，看话题
 </h3>
 <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-widest">找方向：实时捕捉品类内飙升飙热词与内容风向</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="p-5 bg-neutral-50/50 rounded-[20px] border border-neutral-100 flex-1">
 <h4 className="text-[14px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
 <Flame size={16} className="text-orange-500"/> 潜力飙升搜索词
 </h4>
 <div className="space-y-2">
 {[{w: "新手养猫必备清单", up: "+124%"}, {w: "换季猫咪疯狂掉毛", up: "+89%"}, {w: "软便无谷猫粮测评", up: "+65%"}, {w: "幼猫肠胃调理避坑", up: "+42%"}].map((t, i) => (
 <div key={i} onClick={() => window.dispatchEvent(new CustomEvent('open-expert', { detail: { expert: '策略专家', context: `深入分析这个飙升关键词：${t.w}` }}))} className="flex flex-row items-center justify-between group hover:bg-white p-2.5 -mx-2.5 rounded-xl hover:shadow-sm transition-all cursor-pointer">
 <span className="text-[14px] text-slate-700 flex items-center gap-2">
 <span className="w-5 h-5 rounded-md bg-white border border-neutral-200 text-neutral-400 text-[11px] flex items-center justify-center shadow-sm">{i+1}</span>
 {t.w}
 </span>
 <div className="flex items-center gap-2">
 <span className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] text-primary-500 bg-primary-50 px-2 py-1 rounded-md transition-opacity">
 <Sparkles size={12}/> AI 洞察
 </span>
 <span className="text-[12px] text-rose-500 bg-rose-50 px-2.5 py-1 rounded-md">{t.up}</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 <div className="p-5 bg-neutral-50/50 rounded-[20px] border border-neutral-100 flex-1 flex flex-col">
 <h4 className="text-[14px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
 <Hash size={16} className="text-blue-500"/> 爆款话题趋势榜
 </h4>
 <div className="flex flex-wrap gap-2.5 mb-auto">
 {["#经验分享", "#新手养猫", "#平价好物猫粮", "#宠物肠胃保护", "#沉浸式测评", "#无谷低敏"].map((tag, i) => (
 <span 
 key={i} 
 onClick={() => window.dispatchEvent(new CustomEvent('open-expert', { detail: { expert: '内容专家', context: `基于此话题标签，该怎么规划内容：${tag}` }}))}
 className="px-3.5 py-1.5 bg-white border border-neutral-200 text-[13px] text-slate-600 rounded-xl shadow-sm hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-all flex items-center gap-1 group"
 >
 {tag} <Bot size={13} className="opacity-0 group-hover:opacity-100 -mr-1 transition-all" />
 </span>
 ))}
 </div>
 <div className="mt-4 pt-4 border-t border-neutral-200/60 flex items-center gap-3">
 <span className="shrink-0 w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500"><Info size={14}/></span>
 <p className="text-[12px] text-slate-500 leading-relaxed">
 当前品类 <span className="text-rose-500">【图文测评类】</span> 内容互动率处于周期高位，建议优先考虑相关框架。
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Module 2 & 3: 智能选题看板 & 策略推送 */}
 <div className="bg-white rounded-[24px] border border-neutral-100 p-6 shadow-sm">
 <div className="flex items-center justify-between mb-5">
 <div>
 <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight flex items-center gap-2">
 <Target size={18} className="text-blue-500" />
 挑选题，定打法
 </h3>
 <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-widest">挑选一个高优核心选题，并围绕此方向启动内容生产流</p>
 </div>
 </div>

 <div className="space-y-3">
 {[
 { id: 1, title: '换季猫咪疯狂掉毛？3招教你科学应对', vol: '12w+', comp: '竞争红海', cost: '中成本', strategy: '差异化深度长内容 / 实物测评', desc: '在内卷赛道中以专业度和深度评测建立信任，推荐「多图文+表单对比」形式破局。' },
 { id: 2, title: '学生党/打工人平价养猫，百元内无谷粮红黑榜', vol: '8.5w+', comp: '新晋蓝海', cost: '低成本', strategy: '轻量化图文矩阵快速铺量', desc: '趁趋势词流量上升期，核心卖点前置，采用「多封面高频测试」快速获客。' },
 { id: 3, title: '宠物软便克星？实测[核心产品]一月变化', vol: '5w+', comp: '适中', cost: '高成本', strategy: '真实体验记录 Vlog', desc: '高转化率视频类型，通过真实的改善记录切入痛点进行深度种草，适合视频流分发。' },
 ].map(card => (
 <div 
 key={card.id} 
 onClick={() => toggleTopic(card.id, card.title)}
 className={`p-6 rounded-[24px] border transition-all cursor-pointer flex gap-5 overflow-hidden relative ${selectedTopic === card.id ? 'border-primary-500 bg-primary-50/20 shadow-md shadow-primary-500/5' : 'border-neutral-100 bg-neutral-50/50 hover:border-primary-200'}`} 
 >
 <div className="pt-1 select-none flex-shrink-0 z-10">
 {selectedTopic === card.id ? (
 <CheckCircle2 size={22} className="text-primary-500" />
 ) : (
 <div className="w-[22px] h-[22px] rounded-full border-2 border-neutral-300 pointer-events-none" />
 )}
 </div>
 <div className="flex-1 group/item z-10">
 <div className="flex items-start justify-between mb-2">
 <h4 className="text-[15px] font-semibold text-neutral-900 tracking-wide pr-4 leading-snug">{card.title}</h4>
 </div>
 <div className="flex flex-wrap gap-2 mb-3">
 <span className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[12px] text-neutral-600 flex items-center gap-1.5 shadow-sm">
 <BarChart2 size={13} className="text-neutral-400"/> 预期流量 {card.vol}
 </span>
 <span className={`px-3 py-1.5 bg-white border rounded-lg text-[12px] flex items-center gap-1.5 shadow-sm ${card.comp === '竞争红海' ? 'border-rose-200 text-rose-600' : card.comp === '新晋蓝海' ? 'border-blue-200 text-blue-600' : 'border-neutral-200 text-neutral-600'}`}>
 <Activity size={13} className={card.comp === '竞争红海' ? 'text-rose-400' : card.comp === '新晋蓝海' ? 'text-blue-400' : 'text-neutral-400'}/> {card.comp}
 </span>
 <span className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[12px] text-neutral-600 flex items-center gap-1.5 shadow-sm">
 <Coins size={13} className="text-neutral-400"/> {card.cost}
 </span>
 </div>
 <div className={`p-4 rounded-xl border ${selectedTopic === card.id ? 'bg-white border-primary-100' : 'bg-white border-neutral-100'}`}>
 <div className="flex items-center gap-2 mb-1.5">
 <Focus size={15} className={selectedTopic === card.id ? "text-primary-500" : "text-neutral-500"}/>
 <span className="text-[13px] text-slate-800">系统建议推演打法：{card.strategy}</span>
 </div>
 <p className="text-[12px] text-slate-500 pl-6">{card.desc}</p>
 </div>
 </div>
 {selectedTopic === card.id && (
 <div className="absolute right-8 top-8 opacity-10 pointer-events-none">
 <Sparkles size={120} className="text-primary-500"/>
 </div>
 )}
 </div>
 ))}
 </div>
 
 {/* Project Config Section */}
        {(selectedTopic !== null || showConfig) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[24px] border border-neutral-100 p-6 shadow-sm mt-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight flex items-center gap-2">
                  <Package size={18} className="text-primary-500" />
                  项目建档与分发配置
                </h3>
                <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-widest">配置项目基础信息并将策略推入执行大盘</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-neutral-700">项目名称</label>
                <input type="text" placeholder="例如：2026秋季大促矩阵" className="w-full h-12 bg-neutral-50 border border-neutral-200 rounded-xl px-4 text-[14px] outline-none focus:border-primary-500 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-neutral-700">排期起始时间</label>
                <input type="date" className="w-full h-12 bg-neutral-50 border border-neutral-200 rounded-xl px-4 text-[14px] outline-none focus:border-primary-500 focus:bg-white transition-colors text-neutral-700 block" style={{ colorScheme: 'light' }} />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-3">
                <label className="text-[12px] font-medium text-neutral-700">素材执行与归集方式</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div onClick={() => setProjectTargetGroup('internal')} className={`border-2 rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-all ${projectTargetGroup === 'internal' ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 bg-white hover:border-primary-200'}`}>
                    <div className={`w-5 h-5 rounded-full border-4 shrink-0 mt-0.5 ${projectTargetGroup === 'internal' ? 'border-primary-500 bg-white' : 'border-neutral-300 bg-white'}`}></div>
                    <div>
                      <div className="text-[14px] font-semibold text-neutral-900">内部团队执行项目</div>
                      <div className="text-[12px] text-neutral-500 mt-1 leading-relaxed">自动合并相似构图需求，打包发送至企微进行员工排期拍摄</div>
                    </div>
                  </div>
                  <div onClick={() => setProjectTargetGroup('external')} className={`border-2 rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-all ${projectTargetGroup === 'external' ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 bg-white hover:border-primary-200'}`}>
                    <div className={`w-5 h-5 rounded-full border-4 shrink-0 mt-0.5 ${projectTargetGroup === 'external' ? 'border-primary-500 bg-white' : 'border-neutral-300 bg-white'}`}></div>
                    <div>
                      <div className="text-[14px] font-semibold text-neutral-900">外部素人KOC分发</div>
                      <div className="text-[12px] text-neutral-500 mt-1 leading-relaxed">按单篇生成任务下发接单大厅。素人扫码认领，素材自动审核后代发布</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-neutral-100">
               {showConfig && (
                  <button onClick={() => setShowConfig(false)} className="px-6 py-3.5 rounded-xl text-[14px] text-neutral-600 hover:bg-neutral-100 transition-colors">
                    取消个性化
                  </button>
               )}
               <button 
                  onClick={() => {
                    setIsCreating(true);
                    setTimeout(() => {
                      setIsCreating(false);
                      window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: 'matrix' } }));
                    }, 1200);
                  }}
                  className="flex items-center justify-center gap-2 px-10 py-3.5 rounded-xl text-[14px] font-medium transition-all duration-300 bg-neutral-900 text-white hover:bg-primary-500 hover:scale-[1.02] shadow-xl shadow-neutral-200 active:scale-95"
                >
                  {isCreating ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
                  {isCreating ? '正在生成智能排期并创立项目...' : '确认创立并推入工作流'}
                </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )}
  </div>
  </div>
  );
};
