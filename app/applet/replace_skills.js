import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const startPattern = /\{\/\* SKILLS \*\/\}/;
const nextSectionPattern = /\{\/\* FILES \(项目资源\) \*\/\}/;

const startIndex = content.search(startPattern);
const endIndex = content.search(nextSectionPattern);

if (startIndex === -1 || endIndex === -1) {
    console.error("Pattern not found!");
    process.exit(1);
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

const newContent = `        {/* SKILLS */}
        {activeNav === 'skills' && (
          <div className="flex-1 flex flex-col h-full bg-[#fbfbfb]">
             {creatingSkill ? (
                <div className="flex-1 flex flex-col h-full bg-[#fbfbfb]">
                   {/* Header */}
                   <div className="p-4 px-6 border-b border-zinc-200 bg-white flex items-center justify-between shrink-0 shadow-sm relative z-10">
                      <div className="flex items-center gap-4">
                         <button onClick={() => setCreatingSkill(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"><ChevronLeft size={16}/></button>
                         <div>
                            <h1 className="text-lg font-black text-zinc-900 flex items-center gap-2">工作流技能蒸馏大模型构建器 <span className="text-[10px] bg-[#685FAB]/10 text-[#685FAB] px-1.5 py-0.5 rounded uppercase font-bold">Beta</span></h1>
                            <p className="text-[11px] text-zinc-500 font-medium">配置 Prompt、提取用户级配置表单，并打包为独立的 Skill 模块。</p>
                         </div>
                      </div>
                      <button className="bg-[#685FAB] hover:bg-[#685FAB]/90 text-white px-5 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors flex items-center gap-2">
                         <Check size={16}/> 封测通过并部署
                      </button>
                   </div>
                   {/* Body */}
                   <div className="flex-1 flex h-0">
                      {/* Left: Configuration -> AI Talk-to-Create Interface */}
                      <div className="w-1/2 min-w-[500px] border-r border-zinc-200 bg-white flex flex-col">
                         <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                            <h3 className="text-[14px] font-bold text-zinc-800 flex items-center gap-2"><Sparkles size={16} className="text-[#685FAB]"/> 自然语言构建 (Copilot)</h3>
                            <p className="text-[12px] text-zinc-500 mt-1 font-medium">无需编写提示词或配置表单。只需描述你的日常运营 SOP 或痛点需求，AI 将自动思考所需字段并为你打包成标准技能模块。</p>
                         </div>
                         
                         <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-white">
                            {/* Examples for Operations */}
                            <div className="space-y-3">
                               <div className="text-[11px] font-bold text-zinc-400">试试这样说：</div>
                               <div className="grid grid-cols-1 gap-2">
                                  <button className="text-left text-[12px] p-3 rounded-xl border border-zinc-200 hover:border-[#685FAB]/40 hover:bg-[#685FAB]/5 text-zinc-600 transition-colors">
                                     “我需要一个工具，输入小红书爆款链接，提取其核心痛点，然后按【引发共鸣-提出方案-背书-行动呼唤】的结构，帮我洗稿成3篇不同人设的笔记。”
                                  </button>
                                  <button className="text-left text-[12px] p-3 rounded-xl border border-zinc-200 hover:border-[#685FAB]/40 hover:bg-[#685FAB]/5 text-zinc-600 transition-colors">
                                     “帮我做一个小红书评论区控评话术生成器，让我输入网民的负面评论，自动生成高情商、懂梗、且带产品植入的回复。”
                                  </button>
                               </div>
                            </div>

                            {/* Chat History Mock */}
                            <div className="space-y-4 pt-4 border-t border-zinc-100">
                               <div className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"><User size={14}/></div>
                                  <div className="bg-zinc-100 rounded-2xl p-3 text-[13px] text-zinc-800 rounded-tl-none">我想要一个能根据产品功效，自动生成不同平台（小红书/抖音）种草文案的工具。</div>
                               </div>
                               <div className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[#685FAB] flex items-center justify-center text-white shrink-0"><Bot size={14}/></div>
                                  <div className="bg-[#EDEAF2] border border-[#685FAB]/20 rounded-2xl p-4 text-[13px] text-zinc-800 rounded-tl-none space-y-3">
                                     <p>没问题！为了让这个工具好用，我设计了以下表单让运营同学填写：</p>
                                     <ol className="list-decimal pl-4 space-y-1 text-[#685FAB] font-bold text-[12px]">
                                        <li>产品核心卖点 (长文本)</li>
                                        <li>目标情绪风格 (下拉选择：干货/共情/搞笑等)</li>
                                     </ol>
                                     <p>我已将右侧界面更新，您可以直接预览它的长相。如果觉得哪里不合适，随时告诉我修改！👇</p>
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* Input box */}
                         <div className="p-4 border-t border-zinc-200 bg-white">
                            <div className="relative">
                               <textarea className="w-full h-24 border border-zinc-200 rounded-xl p-3 pr-12 text-[13px] resize-none focus:outline-none focus:border-[#685FAB] focus:ring-1 focus:ring-[#685FAB]/20 transition-all bg-zinc-50 focus:bg-white" placeholder="描述你的最新想法或修改建议..."></textarea>
                               <button className="absolute right-3 bottom-3 w-8 h-8 flex items-center justify-center bg-[#685FAB] text-white rounded-lg shadow-sm hover:bg-[#504886] transition-colors">
                                  <Send size={14}/>
                               </button>
                            </div>
                            <div className="flex justify-between items-center mt-3 px-1">
                               <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1"><Info size={12}/> AI 会自动将你的自然语言翻译为底层 Prompt 及表单逻辑。</span>
                               <button className="text-[11px] text-zinc-500 hover:text-[#685FAB] font-bold flex items-center gap-1"><Settings size={12}/> 切换至极客专家模式</button>
                            </div>
                         </div>
                      </div>

                      {/* Right: UI Preview */}
                      <div className="flex-1 bg-zinc-100/50 p-8 flex justify-center overflow-y-auto custom-scrollbar relative">
                         <div className="absolute top-4 right-6 bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> 实时 UI 解析生成
                         </div>
                         <div className="w-full max-w-[400px]">
                            <h3 className="text-[13px] font-bold text-zinc-500 mb-4 text-center uppercase tracking-widest">终端表单呈现预览</h3>
                            
                            <div className="bg-white rounded-2xl shadow-xl border border-zinc-200/60 overflow-hidden">
                               <div className="bg-gradient-to-r from-[#504886] to-[#685FAB] p-5 pb-6">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm ring-1 ring-white/30 text-white"><FlaskConical size={20}/></div>
                                     <div className="text-white">
                                        <h2 className="text-[16px] font-black tracking-wide">小红书爆款文案生成</h2>
                                        <p className="text-[11px] opacity-80 mt-0.5 font-medium">配置并快速调用该节点能力</p>
                                     </div>
                                  </div>
                               </div>
                               
                               <div className="p-6 space-y-5 -mt-2 bg-white rounded-t-2xl relative z-10">
                                  <div className="space-y-2">
                                     <label className="text-[12px] font-bold text-zinc-700 block">产品核心卖点 <span className="text-red-500">*</span></label>
                                     <textarea placeholder="例如：美白、抗老、吸收快..." className="w-full border border-zinc-200 rounded-lg p-3 text-[13px] h-[80px] resize-none outline-none focus:border-[#685FAB] bg-white transition-colors" />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[12px] font-bold text-zinc-700 block">目标情绪风格 <span className="text-red-500">*</span></label>
                                     <select className="w-full border border-zinc-200 rounded-lg p-2.5 text-[13px] font-medium outline-none focus:border-[#685FAB] bg-white transition-colors">
                                        <option value="">请选择...</option>
                                        <option>干货输出</option>
                                        <option>共情发声</option>
                                        <option>沙雕幽默</option>
                                        <option>测评对比</option>
                                     </select>
                                  </div>
                                  <button className="w-full bg-[#685FAB] hover:bg-[#504886] text-white py-3 rounded-xl text-[13px] font-bold transition-all shadow-md hover:shadow-lg mt-2 flex justify-center items-center gap-2">
                                    <Play size={14} className="fill-current" /> 运行并输出内容
                                  </button>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             ) : (
                <>
                 <div className="flex-none p-6 border-b border-zinc-200 bg-white shadow-sm relative z-10">
                    <div className="flex items-center justify-between">
                       <div>
                          <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-2xl font-black text-zinc-900 border-[#685FAB] pb-1 inline-block">Skill 节点中心</h1>
                            <div className="flex items-center bg-zinc-100 rounded-lg p-1 text-[13px] font-bold">
                               <button onClick={() => setSkillMarketTab('my')} className={\`px-4 py-1.5 rounded-md transition-all shadow-sm \${skillMarketTab === 'my' ? 'bg-white text-zinc-800' : 'text-zinc-500 hover:text-zinc-700 shadow-none'}\`}>我的 Skills</button>
                               <button onClick={() => setSkillMarketTab('market')} className={\`px-4 py-1.5 rounded-md transition-all shadow-sm \${skillMarketTab === 'market' ? 'bg-[#685FAB] text-white' : 'text-zinc-500 hover:text-zinc-700 shadow-none'}\`}>发现市场</button>
                            </div>
                          </div>
                          <p className="text-[13px] text-zinc-500 font-medium">配置、管理或安装来自社区和官方的生态能力引擎。</p>
                       </div>
                       <button onClick={() => setCreatingSkill(true)} className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-sm transition-colors flex items-center gap-2">
                           <Plus size={16}/> 构建自定义 Skill
                       </button>
                    </div>
                 </div>

                 {skillMarketTab === 'my' ? (
                   <div className="flex-1 overflow-y-auto custom-scrollbar p-6 xl:p-8 flex flex-col items-center">
                      <div className="max-w-5xl w-full">
                         <div className="mb-10">
                            <h2 className="text-[15px] font-black text-zinc-800 flex items-center gap-2 mb-4">
                               官方预置能力引擎 <span className="text-[11px] font-bold bg-[#685FAB]/10 text-[#685FAB] px-2 py-0.5 rounded-md">稳定版</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                               {[
                                   { name: 'KOC/KOS 异构矩阵引擎', cat: '内容核心', mode: 'Cloud', catCol: 'emerald', active: true, desc: '自动注入 Geo-Delta(地理差分)变量与破冰话术，纯 Python(LangGraph) 逻辑实现。' },
                                   { name: '物理级图文洗稿裂变 (Mutator)', cat: '防重视觉', mode: 'Tauri', catCol: 'red', active: true, desc: '调取本地 CPU/GPU，结合本地环境注入微小噪点、防重写元素，彻底转移视觉算力成本。' },
                                   { name: '边缘无头浏览器引擎', cat: '数据巡检', mode: 'Tauri', isCustomMain: true, active: false, desc: '利用真实本地设备环境特征调度自动化动作，绕过云拨测检测策略。' },
                               ].map(sk => (
                                   <div className={\`bg-white border \${sk.active ? 'border-zinc-200 hover:border-[#685FAB]/30' : 'border-zinc-100 opacity-70'} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer\`} key={sk.name}>
                                      <div>
                                         <div className="flex justify-between items-start mb-3">
                                            <span className="text-[10px] font-bold text-[#685FAB] bg-[#685FAB]/10 border border-[#685FAB]/20 px-2.5 py-0.5 rounded-md">{sk.cat}</span>
                                            {sk.mode === 'Tauri' ? (
                                                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded flex items-center gap-1"><Cpu size={10}/> Tauri 算力</span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded flex items-center gap-1"><Cloud size={10}/> 云端集群</span>
                                            )}
                                         </div>
                                         <h3 className="text-[15px] font-bold text-zinc-900 mb-2 truncate group-hover:text-[#685FAB] transition-colors">{sk.name}</h3>
                                         <p className="text-[12px] text-zinc-500 font-medium leading-relaxed min-h-[36px]">{sk.desc}</p>
                                      </div>
                                      <div className="flex justify-between items-center border-t border-zinc-100 pt-3 mt-4">
                                         {sk.active ? (
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#685FAB]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#685FAB] animate-pulse" /> 服务连通正常
                                            </div>
                                         ) : (
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" /> 未就绪
                                            </div>
                                         )}
                                         {!sk.active && (
                                             <button className="text-[11px] font-bold text-zinc-500 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded transition-colors">激活引擎</button>
                                         )}
                                      </div>
                                   </div>
                               ))}
                            </div>
                         </div>

                         <div>
                            <h2 className="text-[15px] font-black text-zinc-800 flex items-center gap-2 mb-4">
                               用户自定义节点 <span className="text-[12px] font-medium text-zinc-500 font-normal">· 基于工作流蒸馏生成</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                               <div onClick={() => setCreatingSkill(true)} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm relative group hover:border-[#685FAB]/30 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer">
                                  <div>
                                      <div className="flex justify-between items-start mb-3">
                                         <span className="text-[11px] font-bold text-[#685FAB] bg-[#685FAB]/5 border border-[#685FAB]/20 px-2.5 py-0.5 rounded-md flex items-center gap-1"><TerminalSquare size={10}/> 本地部署</span>
                                         <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded flex items-center gap-1"><Clock size={10}/> 无人值守 (RPA)</span>
                                         </div>
                                      </div>
                                      <h3 className="text-[15px] font-bold text-zinc-900 mb-2 group-hover:text-[#685FAB] transition-colors leading-tight">竞品摘要仿写 RPA 助手</h3>
                                      <p className="text-[12px] text-zinc-500 font-medium leading-relaxed mb-4 line-clamp-3">自动抓取3个固定竞品账号在指定关键词下的最热笔记标题，分析爆款规律格式结构规律，并作为素材下发到Pipeline中。</p>
                                  </div>
                                  <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                                     <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 每 6 小时巡检
                                     </div>
                                     <button className="text-[12px] font-bold text-[#685FAB] bg-[#685FAB]/5 hover:bg-[#685FAB]/10 px-2.5 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#685FAB]/20 flex items-center gap-1"><Settings size={12}/> RPA配置</button>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                 ) : (
                   /* MARKET VIEW */
                   <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                      {/* Hero Banner */}
                      <div className="bg-zinc-900 px-8 py-12 relative overflow-hidden">
                         <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#685FAB]/20 to-transparent"></div>
                         <div className="max-w-5xl mx-auto relative z-10 flex items-center justify-between">
                            <div className="max-w-xl">
                               <div className="flex items-center gap-2 mb-4">
                                  <span className="bg-[#685FAB]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">本周重磅推荐</span>
                               </div>
                               <h1 className="text-4xl font-black text-white mb-4 leading-tight">全域多维数据洞察引擎 <br/><span className="text-[#A29AD6]">DataNexus Pro</span></h1>
                               <p className="text-[14px] text-zinc-300 font-medium leading-relaxed mb-8">
                                  连接小红书、抖音、淘宝生意参谋，通过统一的映射规则清洗多维度运营数据。全自动生成归因图表，直指转化漏斗断层。
                               </p>
                               <div className="flex gap-4">
                                  <button className="bg-[#685FAB] hover:bg-[#504886] text-white px-6 py-3 rounded-xl text-[14px] font-bold transition-all shadow-lg shadow-[#685FAB]/20 flex items-center gap-2">
                                     <DownloadCloud size={18}/> 免费安装入库
                                  </button>
                                  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-[14px] font-bold transition-all flex items-center gap-2">
                                     查看详情
                                  </button>
                               </div>
                            </div>
                            
                            <div className="hidden lg:block w-72 h-64 bg-black/40 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-md transform rotate-2">
                               <div className="flex items-center gap-2 mb-4 px-2">
                                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                               </div>
                               <div className="space-y-3">
                                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                  <div className="h-4 bg-white/10 rounded w-full"></div>
                                  <div className="h-4 bg-white/10 rounded w-5/6"></div>
                                  <div className="h-20 bg-[#685FAB]/30 rounded w-full mt-6 border border-[#685FAB]/50 flex items-center justify-center">
                                     <BarChart2 size={32} className="text-[#A29AD6]/50" />
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="max-w-5xl mx-auto p-8 py-10">
                         {/* Categories Filter */}
                         <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 custom-scrollbar">
                            <button className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-[13px] font-bold shrink-0">全部推荐</button>
                            <button className="bg-zinc-100 text-zinc-600 hover:text-zinc-900 px-4 py-2 rounded-lg text-[13px] font-bold shrink-0 transition-colors">内容创作 (AI Generative)</button>
                            <button className="bg-zinc-100 text-zinc-600 hover:text-zinc-900 px-4 py-2 rounded-lg text-[13px] font-bold shrink-0 transition-colors">数据分析与洞察</button>
                            <button className="bg-zinc-100 text-zinc-600 hover:text-zinc-900 px-4 py-2 rounded-lg text-[13px] font-bold shrink-0 transition-colors">全托管 RPA</button>
                            <button className="bg-zinc-100 text-zinc-600 hover:text-zinc-900 px-4 py-2 rounded-lg text-[13px] font-bold shrink-0 transition-colors">官方工具套件</button>
                         </div>

                         {/* Grid */}
                         <h2 className="text-[18px] font-black text-zinc-900 mb-6">社区精选工具</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                               { name: '竞品日均销量监控仪', author: '@DataMiner', downloads: '1.2w+', rating: '4.9', icon: BarChart2, type: 'RPA', installed: false },
                               { name: '抖音切片混剪流水线', author: '@VideoMage', downloads: '8.4k+', rating: '4.7', icon: Play, type: 'Tauri', installed: false },
                               { name: '小红书反封禁规避词库', author: '@Official', downloads: '3.1w+', rating: '5.0', icon: BookOpen, type: 'Data', installed: true },
                               { name: '评论区高情商控评bot', author: '@SocialGenius', downloads: '5.6k+', rating: '4.8', icon: MessageSquare, type: 'AI', installed: false },
                               { name: '全图替换脱敏工具', author: '@MutatorLabs', downloads: '4.2k+', rating: '4.6', icon: ImageIcon, type: 'Tauri', installed: false },
                               { name: '达人沟通BD邀约助手', author: '@MCN_King', downloads: '9.8k+', rating: '4.9', icon: Users, type: 'AI', installed: false }
                            ].map((item, idx) => (
                               <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-[#685FAB]/40 hover:shadow-lg transition-all group flex flex-col justify-between">
                                  <div>
                                     <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-700 group-hover:scale-110 group-hover:text-[#685FAB] transition-all">
                                           <item.icon size={22} />
                                        </div>
                                        <span className="text-[10px] font-bold bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded">{item.type}</span>
                                     </div>
                                     <h3 className="text-[15px] font-bold text-zinc-900 mb-1">{item.name}</h3>
                                     <p className="text-[12px] text-zinc-500 font-medium mb-4">提供稳定开箱即用的运营辅助能力，大幅降低机械操作成本。</p>
                                  </div>
                                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                                     <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-zinc-700">{item.author}</span>
                                        <span className="text-[10px] text-zinc-400 font-medium">{item.downloads} 次安装 · ★ {item.rating}</span>
                                     </div>
                                     {item.installed ? (
                                        <button className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1 border border-emerald-100 cursor-default">
                                           <Check size={14}/> 已安装
                                        </button>
                                     ) : (
                                        <button className="text-[12px] font-bold text-white bg-zinc-900 hover:bg-[#685FAB] px-4 py-1.5 rounded-lg transition-colors">
                                            获取
                                        </button>
                                     )}
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                 )}
                </>
             )}
          </div>
        )}
`;

fs.writeFileSync('src/App.tsx', before + newContent + after);
