import React, { useState } from 'react';
import { Search, ChevronRight, X, AlertTriangle, CheckCircle2, Bot, Database, History, BookOpen, Settings, Filter, FileText, ChevronDown, Plus, Play, Info, ArrowUpRight, FolderKanban, CheckSquare, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  activeProject?: any;
}

export function SearchKeywordsExplorer({ activeProject }: Props) {
  const [mode, setMode] = useState<'home' | 'running' | 'results' | 'history' | 'error'>('home');
  const [keyword, setKeyword] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Results State
  const [activeTab, setActiveTab] = useState<'themes' | 'keywords' | 'pending'>('themes');
  const [drawer, setDrawer] = useState<'theme' | 'keyword' | 'evidence' | 'ai' | 'preview' | 'batch' | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const startExplore = () => {
    if (!keyword) return;
    setMode('running');
    setTimeout(() => {
      setMode('results');
    }, 4000); // mock process
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fcfcfc] overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-neutral-100 px-6 flex items-center justify-between shrink-0 bg-white shadow-sm z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center cursor-pointer" onClick={() => setMode("error")}>
            <Search size={16} />
          </div>
          <div>
            <h1 className="text-[16px] font-bold text-neutral-900 tracking-tight">搜索词探索</h1>
            <p className="text-[11px] text-neutral-500 font-medium">从一个目标词出发，筛选商家能够真实承接的表达与内容主题。</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setMode('history')} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-neutral-600 hover:bg-neutral-50 rounded-lg">
            <History size={14} /> 运行记录
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          {mode === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center p-8">
              <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden">
                <div className="p-8 pb-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 mx-auto flex items-center justify-center mb-4">
                    <Search size={32} />
                  </div>
                  <h2 className="text-[20px] font-bold text-neutral-900 mb-2">开始新的探索</h2>
                  <p className="text-[13px] text-neutral-500 max-w-md mx-auto">
                    调用外部搜索词观察工具，获取联想词并结合商家知识判断哪些表达可以承接。当前结果不代表搜索量或竞争度。
                  </p>
                </div>

                <div className="px-8 pb-8 space-y-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                      <input 
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        placeholder="输入核心目标词，例如：敏感肌护肤"
                        className="w-full h-12 pl-12 pr-4 bg-neutral-50 border border-neutral-200 rounded-xl text-[15px] outline-none focus:border-primary-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                    
                    <div className="flex items-center gap-4 text-[13px]">
                      <div className="flex items-center gap-2 text-neutral-700 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
                        <span className="text-neutral-500">当前商家:</span>
                        <span className="font-bold">默认商家</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-700 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
                        <span className="text-neutral-500">关联项目:</span>
                        <span className="font-bold text-primary-600">{activeProject?.name || '无'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 pt-6">
                    <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 text-[13px] font-bold text-neutral-600 hover:text-neutral-900 mb-4">
                      <Settings size={14} /> 添加约束条件 <ChevronDown size={14} className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showAdvanced && (
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1.5">
                          <label className="text-[12px] text-neutral-500">目标人群</label>
                          <input placeholder="如: 新手养宠" className="w-full px-3 py-2 text-[13px] border border-neutral-200 rounded-lg outline-none focus:border-primary-500" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[12px] text-neutral-500">不可用的表达</label>
                          <input placeholder="如: 医疗化词汇" className="w-full px-3 py-2 text-[13px] border border-neutral-200 rounded-lg outline-none focus:border-primary-500" />
                        </div>
                        <div className="col-span-2 flex gap-6 mt-2">
                          <label className="flex items-center gap-2 text-[13px] text-neutral-700 cursor-pointer">
                            <input type="checkbox" defaultChecked className="accent-primary-600" /> 使用商家知识
                          </label>
                          <label className="flex items-center gap-2 text-[13px] text-neutral-700 cursor-pointer">
                            <input type="checkbox" defaultChecked className="accent-primary-600" /> 结合历史项目经验
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={startExplore}
                    className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Play size={16} /> 开始探索
                  </button>

                  <div className="flex items-center justify-center gap-6 pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
                      <CheckCircle2 size={12} /> 商家知识: 已连接
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
                      <CheckCircle2 size={12} /> 观察工具: 可用
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                      <Bot size={12} /> 规划引擎: Default v2.1
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {mode === 'running' && (
            <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center p-8">
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-neutral-100 p-8 text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-neutral-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-primary-500">
                    <Search size={32} />
                  </div>
                </div>
                <h2 className="text-[18px] font-bold text-neutral-900 mb-2">正在探索 "{keyword}"</h2>
                <div className="space-y-3 text-[13px] text-neutral-500 max-w-sm mx-auto text-left">
                  <div className="flex items-center gap-3 text-primary-600"><CheckCircle2 size={14}/> 正在获取搜索联想...</div>
                  <div className="flex items-center gap-3 text-neutral-900"><Activity size={14} className="animate-pulse"/> 正在清洗重复表达...</div>
                  <div className="flex items-center gap-3 opacity-50"><Bot size={14}/> 正在识别人群与意图...</div>
                  <div className="flex items-center gap-3 opacity-50"><Database size={14}/> 正在核对商家事实与素材...</div>
                </div>
              </div>
            </motion.div>
          )}

          {mode === 'results' && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col">
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-[24px] font-extrabold text-neutral-900 tracking-tight flex items-center gap-3">
                      "{keyword}" 探索结果
                      <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded text-[11px] font-medium tracking-normal align-middle">
                        刚刚运行
                      </span>
                    </h2>
                    <p className="text-[13px] text-neutral-500 mt-1 flex items-center gap-4">
                      <span>观察到 156 个表达</span>
                      <span className="text-emerald-600">42 个商家可用</span>
                      <span className="text-amber-600">8 个待确认</span>
                      <span className="text-red-500">12 个风险</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setDrawer('ai')} className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-primary-100">
                      <Bot size={16} /> 重新整理结果
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-6 border-b border-neutral-200">
                  <button onClick={() => setActiveTab('themes')} className={`pb-3 text-[14px] font-bold border-b-2 transition-colors ${activeTab === 'themes' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
                    主题建议 (6)
                  </button>
                  <button onClick={() => setActiveTab('keywords')} className={`pb-3 text-[14px] font-bold border-b-2 transition-colors ${activeTab === 'keywords' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
                    搜索词 (156)
                  </button>
                  <button onClick={() => setActiveTab('pending')} className={`pb-3 text-[14px] font-bold border-b-2 transition-colors ${activeTab === 'pending' ? 'border-amber-500 text-amber-600' : 'border-transparent text-amber-600/70 hover:text-amber-600'}`}>
                    待处理事项 (8)
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'themes' && (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3,4,5,6].map((i) => (
                      <div key={i} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col hover:border-primary-300 transition-colors">
                        <div className="p-5 border-b border-neutral-100 cursor-pointer" onClick={() => setDrawer('theme')}>
                          <div className="flex items-start justify-between mb-3">
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[11px] font-bold">可直接验证</span>
                            <span className="text-[12px] text-neutral-400">产品对象</span>
                          </div>
                          <h3 className="text-[16px] font-bold text-neutral-900 mb-2">{keyword} 哪个牌子好</h3>
                          <p className="text-[13px] text-neutral-600 line-clamp-2">推荐角度：通过实测对比展示产品A的独特成分，解答新手选择困难。</p>
                        </div>
                        <div className="p-5 bg-neutral-50 flex-1 space-y-4">
                           <div>
                             <div className="text-[11px] text-neutral-500 mb-1.5 font-medium">主表达</div>
                             <div className="text-[13px] font-bold text-neutral-900">{keyword} 推荐平价</div>
                           </div>
                           <div>
                             <div className="text-[11px] text-neutral-500 mb-1.5 font-medium">商家依据</div>
                             <div className="text-[12px] text-emerald-600 flex items-start gap-1">
                               <CheckCircle2 size={14} className="shrink-0 mt-0.5" /> 知识库中已存在竞品对比评测报告及成分说明。
                             </div>
                           </div>
                        </div>
                        <div className="p-4 bg-white border-t border-neutral-100 flex gap-2">
                           <button className="flex-1 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold hover:bg-neutral-800">加入项目</button>
                           <button onClick={() => setDrawer('batch')} className="flex-1 py-2 bg-primary-50 text-primary-600 rounded-lg text-[13px] font-bold hover:bg-primary-100">创建批次</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {activeTab === 'keywords' && (
                  <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 text-[12px] text-neutral-500 border-b border-neutral-200">
                          <th className="p-4 font-medium">搜索表达</th>
                          <th className="p-4 font-medium">语义类型</th>
                          <th className="p-4 font-medium">所属主题</th>
                          <th className="p-4 font-medium">商家适配</th>
                          <th className="p-4 font-medium">内容准备度</th>
                          <th className="p-4 font-medium">操作</th>
                        </tr>
                      </thead>
                      <tbody className="text-[13px]">
                        {[1,2,3,4,5].map(i => (
                          <tr key={i} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                            <td className="p-4 font-bold text-neutral-900 cursor-pointer hover:text-primary-600" onClick={() => setDrawer('keyword')}>{keyword} 怎么选</td>
                            <td className="p-4 text-neutral-600">用户问题</td>
                            <td className="p-4 text-neutral-600">新手选择指南</td>
                            <td className="p-4"><span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">可用</span></td>
                            <td className="p-4 text-neutral-600">事实与素材齐备</td>
                            <td className="p-4">
                              <button className="text-primary-600 font-medium hover:underline">详情</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'pending' && (
                  <div className="space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-amber-200 flex items-center justify-between shadow-sm">
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                          <AlertTriangle size={20} />
                        </div>
                        <div>
                          <h4 className="text-[15px] font-bold text-neutral-900 mb-1">词义不明确: "{keyword} 黑话"</h4>
                          <p className="text-[13px] text-neutral-600">该表达在搜索中出现，但AI无法确认是否为行业术语或负面词汇。</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-[13px] font-bold whitespace-nowrap">人工判断</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {mode === "error" && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center p-8">
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-neutral-100 p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-6">
                  <AlertTriangle size={32} />
                </div>
                <h2 className="text-[18px] font-bold text-neutral-900 mb-2">获取搜索联想失败</h2>
                <p className="text-[13px] text-neutral-500 max-w-sm mx-auto mb-6">
                  外部搜索词观察工具接口超时（Error 504）。请检查网络连接或稍后重试。
                </p>
                <div className="flex gap-4 justify-center">
                  <button onClick={() => setMode("home")} className="px-6 py-2.5 bg-neutral-100 text-neutral-700 font-bold rounded-xl text-[13px]">返回首页</button>
                  <button onClick={startExplore} className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl text-[13px]">重新尝试</button>
                </div>
              </div>
            </motion.div>
          )}
          {mode === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 p-8">
               <h2 className="text-[20px] font-bold mb-6">运行记录</h2>
               <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                 <table className="w-full text-left text-[13px]">
                   <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                     <tr>
                       <th className="p-4 font-medium">目标词</th>
                       <th className="p-4 font-medium">运行时间</th>
                       <th className="p-4 font-medium">结果数量</th>
                       <th className="p-4 font-medium">操作</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr className="border-b border-neutral-100">
                       <td className="p-4 font-bold">{keyword || '敏感肌护肤'}</td>
                       <td className="p-4 text-neutral-600">2026-07-24 10:30</td>
                       <td className="p-4 text-neutral-600">156 词 / 6 主题</td>
                       <td className="p-4"><button onClick={() => setMode('results')} className="text-primary-600 font-bold hover:underline">查看结果</button></td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drawers */}
        <AnimatePresence>
          {drawer === 'keyword' && (
             <div className="absolute inset-0 z-50 flex justify-end">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={() => setDrawer(null)} />
               <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="w-[500px] bg-white h-full shadow-2xl flex flex-col relative z-10">
                 <div className="p-6 border-b border-neutral-100 flex justify-between items-start">
                   <div>
                     <h2 className="text-[20px] font-bold text-neutral-900 mb-1">{keyword} 怎么选</h2>
                     <p className="text-[13px] text-neutral-500">原始表达: {keyword}怎么选啊</p>
                   </div>
                   <button onClick={() => setDrawer(null)} className="p-2 text-neutral-400 hover:text-neutral-900 bg-neutral-50 rounded-lg"><X size={20} /></button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-6 space-y-8">
                   <div>
                     <h3 className="text-[13px] font-bold text-neutral-400 mb-3 uppercase tracking-wider">AI判断与商家适配</h3>
                     <div className="space-y-3">
                       <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                         <span className="text-[13px] text-neutral-600">语义类型</span>
                         <span className="text-[13px] font-bold">用户问题</span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                         <span className="text-[13px] text-neutral-600">商家适配</span>
                         <span className="text-[13px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">可用</span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                         <span className="text-[13px] text-neutral-600">内容准备度</span>
                         <span className="text-[13px] font-bold">事实与素材齐备</span>
                       </div>
                     </div>
                   </div>

                   <div>
                     <h3 className="text-[13px] font-bold text-neutral-400 mb-3 uppercase tracking-wider flex items-center justify-between">
                       证据来源 <button onClick={() => setDrawer('evidence')} className="text-primary-600 text-[12px] flex items-center gap-1 hover:underline">查看底层数据 <ArrowUpRight size={12}/></button>
                     </h3>
                     <div className="bg-neutral-50 p-4 rounded-xl space-y-3">
                       <div className="flex gap-2 items-start">
                         <Database size={16} className="text-neutral-400 mt-0.5 shrink-0" />
                         <div className="text-[13px] text-neutral-700">来自「搜索联想观察」工具。</div>
                       </div>
                       <div className="flex gap-2 items-start">
                         <BookOpen size={16} className="text-primary-500 mt-0.5 shrink-0" />
                         <div className="text-[13px] text-neutral-700">匹配商家知识：<span className="font-bold">《2024产品核心卖点.pdf》</span> 中已包含选购指南章节。</div>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div className="p-6 border-t border-neutral-100 flex gap-3">
                   <button className="flex-1 py-3 bg-neutral-100 text-neutral-700 font-bold rounded-xl text-[13px]">标记排除</button>
                   <button className="flex-1 py-3 bg-neutral-900 text-white font-bold rounded-xl text-[13px]">确认为可用</button>
                 </div>
               </motion.div>
             </div>
          )}

          {drawer === 'batch' && (
             <div className="absolute inset-0 z-50 flex justify-end">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={() => setDrawer(null)} />
               <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="w-[600px] bg-white h-full shadow-2xl flex flex-col relative z-10">
                 <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
                   <h2 className="text-[20px] font-bold text-neutral-900">创建验证批次</h2>
                   <button onClick={() => setDrawer(null)} className="p-2 text-neutral-400 hover:text-neutral-900 bg-neutral-50 rounded-lg"><X size={20} /></button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
                   <div className="p-4 bg-primary-50 text-primary-700 rounded-xl text-[13px] flex gap-3">
                     <Bot size={18} className="shrink-0 mt-0.5" />
                     <p>AI 已根据主题自动生成验证方案，您可手动修改配置后下发执行。</p>
                   </div>
                   
                   <div className="space-y-4">
                     <div className="space-y-2">
                       <label className="text-[13px] font-bold text-neutral-700">预期执行效果</label>
                       <textarea className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-[13px] resize-none h-20" defaultValue="验证通过实测对比的内容形式，是否能有效提升用户在搜索该词时的点击与停留时长。" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-[13px] font-bold text-neutral-700">所需笔记数</label>
                         <input type="number" defaultValue="5" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-[13px]" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[13px] font-bold text-neutral-700">账号类型要求</label>
                         <select className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-[13px]">
                           <option>KOC + 品牌号</option>
                           <option>仅 KOC</option>
                           <option>仅店长号</option>
                         </select>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div className="p-6 border-t border-neutral-100 flex justify-end gap-3">
                   <button onClick={() => setDrawer(null)} className="px-6 py-2.5 bg-neutral-100 text-neutral-700 font-bold rounded-xl text-[13px]">取消</button>
                   <button onClick={() => setDrawer(null)} className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl text-[13px]">创建筹备批次</button>
                 </div>
               </motion.div>
             </div>
          )}
          {drawer === "ai" && (
             <div className="absolute inset-0 z-50 flex justify-end">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={() => setDrawer(null)} />
               <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="w-[500px] bg-white h-full shadow-2xl flex flex-col relative z-10">
                 <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
                   <h2 className="text-[20px] font-bold text-neutral-900">AI 复盘与整理</h2>
                   <button onClick={() => setDrawer(null)} className="p-2 text-neutral-400 hover:text-neutral-900 bg-neutral-50 rounded-lg"><X size={20} /></button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
                   <div className="bg-primary-50 p-4 rounded-xl flex gap-3">
                     <Bot size={20} className="text-primary-600 shrink-0" />
                     <p className="text-[13px] text-neutral-700 leading-relaxed">
                       基于本次搜索词探索，AI 发现：<br/><br/>
                       1. 目标人群对于 <span className="font-bold">成分、安全性</span> 的关注度高于价格。<br/>
                       2. 出现了 12 个风险词汇，建议在后续内容创作中予以规避。<br/>
                       3. 主题“新手选择指南”的潜力极高，建议作为优先执行批次。
                     </p>
                   </div>
                   <div className="space-y-4">
                     <h3 className="text-[14px] font-bold text-neutral-900">建议操作</h3>
                     <button onClick={() => { setDrawer(null); window.dispatchEvent(new CustomEvent("nav-to-strategy-start")); }} className="w-full text-left p-4 rounded-xl border border-neutral-200 hover:border-primary-500 transition-colors">
                       <div className="font-bold text-[14px] text-neutral-900">更新项目策略基线</div>
                       <div className="text-[13px] text-neutral-500 mt-1">将上述发现沉淀至当前项目的策略依据中。</div>
                     </button>
                     <button className="w-full text-left p-4 rounded-xl border border-neutral-200 hover:border-primary-500 transition-colors">
                       <div className="font-bold text-[14px] text-neutral-900">创建专项内容需求</div>
                       <div className="text-[13px] text-neutral-500 mt-1">围绕“成分与安全性”自动生成内容大纲与需求工单。</div>
                     </button>
                   </div>
                 </div>
               </motion.div>
             </div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer Edge Warning */}
      <div className="h-10 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-center text-[11px] text-neutral-400 shrink-0">
        当前结果来自搜索联想观察与商家适配分析，不代表搜索量、排名或竞争度。候选词仍需通过项目执行验证。
      </div>
    </div>
  );
}

// Ensure the icons missing from imports are correctly referenced or use alternatives.
// I added BookOpen missing import by replacing it with Database/FileText in usage, wait, I need to add BookOpen.
