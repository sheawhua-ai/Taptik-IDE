import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('{/* Skill Market / Tool Marketplace */}');
const endIndex = content.indexOf('{/* FILES (本地知识库与资产) */}');

if (startIndex === -1 || endIndex === -1) {
    console.error("Pattern not found!");
    process.exit(1);
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

const newContent = `{/* Skill Market / Tool Marketplace */}
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
                                  <button className="text-left text-[12px] p-3 rounded-xl border border-zinc-200 hover:border-[#685FAB]/40 hover:bg-[#685FAB]/5 text-[#685FAB] font-bold transition-colors shadow-sm bg-white">
                                     “我需要一个工具，输入小红书爆款链接，提取其核心痛点，然后按结构帮我洗稿成3篇不同人设的笔记...”
                                  </button>
                                  <button className="text-left text-[12px] p-3 rounded-xl border border-zinc-200 hover:border-[#685FAB]/40 hover:bg-[#685FAB]/5 text-zinc-600 transition-colors bg-white">
                                     “帮我做一个小红书评论区控评话术生成器，输入负面评论能自动生成高情商、懂梗、带产品植入的回复...”
                                  </button>
                                  <button className="text-left text-[12px] p-3 rounded-xl border border-zinc-200 hover:border-[#685FAB]/40 hover:bg-[#685FAB]/5 text-zinc-600 transition-colors bg-white">
                                     “做个自动化脚本，每12小时去爬取这几个对标账号的最新图文，把图存到资源库里...”
                                  </button>
                               </div>
                            </div>

                            {/* Chat History Mock */}
                            <div className="space-y-4 pt-4 border-t border-zinc-100">
                               <div className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"><User size={14}/></div>
                                  <div className="bg-zinc-100 rounded-2xl p-3 text-[13px] text-zinc-800 rounded-tl-none leading-relaxed">我想要一个能根据产品功效，自动生成不同平台（小红书/抖音）种草文案的工具。</div>
                               </div>
                               <div className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[#685FAB] flex items-center justify-center text-white shrink-0"><Bot size={14}/></div>
                                  <div className="bg-[#EDEAF2] border border-[#685FAB]/20 rounded-2xl p-4 text-[13px] text-zinc-800 rounded-tl-none space-y-3 leading-relaxed">
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
                   <div className="flex-1 overflow-y-auto custom-scrollbar bg-white flex flex-col">
                      {/* Hero Banner with Introduction & Example */}
                      <div className="bg-gradient-to-r from-zinc-900 via-[#1A1829] to-zinc-900 px-8 py-14 relative overflow-hidden shrink-0">
                         <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-[#685FAB]/30 via-transparent to-transparent"></div>
                         <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                            <div className="max-w-2xl">
                               <div className="flex items-center gap-2 mb-5">
                                  <span className="bg-[#685FAB] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">本周主推生态能力</span>
                                  <span className="text-zinc-400 text-[12px] font-medium flex items-center"><User size={12} className="mr-1"/> 官方团队构建</span>
                               </div>
                               <h1 className="text-4xl font-black text-white mb-5 leading-tight tracking-tight">KOC/KOS 全域异构矩阵引擎 <br/><span className="text-[#A29AD6]">DataNexus Pro Node</span></h1>
                               <p className="text-[14px] text-zinc-300 font-medium leading-relaxed mb-8">
                                  该引擎解决了一个核心痛点：多账号矩阵发布内容被平台判定为重复违规。通过引入真实的「地理差分数据」与「用户微行为模拟」，结合边缘计算算力，为每一篇下发的素材进行深度的、千人千面的物理级改写。极大提升矩阵号的存活率和互动转化。
                               </p>
                               <div className="flex gap-4">
                                  <button className="bg-white hover:bg-zinc-100 text-zinc-900 px-6 py-3 rounded-xl text-[14px] font-bold transition-all shadow-lg flex items-center gap-2">
                                     <DownloadCloud size={18}/> 获取并安装到项目
                                  </button>
                                  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-[14px] font-bold transition-all flex items-center gap-2">
                                     <BookOpen size={18}/> 查看文档和教程
                                  </button>
                               </div>
                            </div>
                            
                            {/* Process Example UI in Banner */}
                            <div className="hidden lg:block flex-1 max-w-sm w-full bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative transform hover:scale-[1.02] transition-transform duration-500">
                               <div className="flex items-center gap-2 mb-5 px-1 border-b border-white/10 pb-4">
                                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><Workflow size={16}/></div>
                                  <div>
                                     <div className="text-[13px] font-bold text-white tracking-wide">执行示例</div>
                                     <div className="text-[10px] text-zinc-400">实时流程透视可视化</div>
                                  </div>
                               </div>
                               <div className="space-y-4 relative">
                                  {/* Line connector */}
                                  <div className="absolute left-[11px] top-6 bottom-6 w-px bg-gradient-to-b from-white/20 via-[#685FAB]/50 to-white/10"></div>
                                  
                                  <div className="flex gap-3 relative z-10">
                                     <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-[10px] font-bold backdrop-blur-sm shrink-0">1</div>
                                     <div className="text-[12px] text-zinc-300 pt-0.5"><strong className="text-white">输入：</strong>基础品牌宣发稿件 & 预设 50 个分发账号。</div>
                                  </div>
                                  <div className="flex gap-3 relative z-10">
                                     <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-[10px] font-bold backdrop-blur-sm shrink-0">2</div>
                                     <div className="text-[12px] text-zinc-300 pt-0.5"><strong className="text-[#A29AD6]">物理改写：</strong>引擎自动将首图植入不可见高斯噪点防重图。</div>
                                  </div>
                                  <div className="flex gap-3 relative z-10">
                                     <div className="w-6 h-6 rounded-full bg-[#685FAB] border border-[#685FAB]/50 flex items-center justify-center text-white text-[10px] font-bold backdrop-blur-sm shadow-[0_0_10px_rgba(104,95,171,0.5)] shrink-0 group">
                                         <div className="w-2 h-2 bg-white rounded-full animate-ping absolute"></div>
                                         <div className="w-2 h-2 bg-white rounded-full"></div>
                                     </div>
                                     <div className="text-[12px] text-zinc-300 pt-0.5"><strong className="text-emerald-400">差异化生成：</strong>基于账号地理位置，将开头替换为：“身在成都的姐妹们...”。</div>
                                  </div>
                                  <div className="flex gap-3 relative z-10">
                                     <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-[10px] font-bold backdrop-blur-sm shrink-0">4</div>
                                     <div className="text-[12px] text-zinc-300 pt-0.5"><strong className="text-white">分发：</strong>推送到 Pipeline 等待下发。</div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="max-w-6xl mx-auto w-full p-8 py-10">
                         <div className="flex items-center justify-between mb-8">
                            <h2 className="text-[18px] font-black text-zinc-900">社区精选生态</h2>
                            {/* Categories Filter */}
                            <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-xl">
                               <button className="bg-white text-zinc-900 px-4 py-1.5 rounded-lg text-[13px] font-bold shadow-sm">最新发布</button>
                               <button className="text-zinc-500 hover:text-zinc-900 hover:bg-white/50 px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all">最多安装</button>
                               <button className="text-zinc-500 hover:text-zinc-900 hover:bg-white/50 px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all">官方团队推荐</button>
                            </div>
                         </div>

                         {/* Grid */}
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                               { name: '跨平台竞品销量监测', author: '@DataMiner', downloads: '1.2w+', rating: '4.9', icon: BarChart2, type: '数据分析', installed: false, desc: '静默抓取竞品达人橱窗数据，本地清洗去重后生成销量预估模型趋势图。' },
                               { name: '评论区高情商控评bot', author: '@SocialGenius', downloads: '5.6k+', rating: '4.8', icon: MessageSquare, type: '用户交互', installed: false, desc: '实时监控帖子评论区负面词汇，秒级生成带软植入的高情商幽默回复，适合做品牌公关。' },
                               { name: '自动批量达人BD邀约', author: '@MCN_King', downloads: '9.8k+', rating: '4.9', icon: Users, type: '全链 RPA', installed: false, desc: '一键抓取热门达人主页联系方式，自动构建定制化合作邀约邮件或私信。' },
                               { name: '小红书反封禁规避词库', author: '@Official_Team', downloads: '3.1w+', rating: '5.0', icon: BookOpen, type: '内容安全', installed: true, desc: '官方维护的行业敏感词热更全库，支持在 Pipeline 发布前拦截并自动替换发音/形近字。' },
                               { name: '图片级脱敏处理器', author: '@MutatorLabs', downloads: '4.2k+', rating: '4.6', icon: ImageIcon, type: '本地算力', installed: false, desc: '调用 Tauri 客户端端侧画笔，利用本地显卡切分掩码将竞品图片重新二创。' },
                               { name: '多维矩阵复盘生成器', author: '@AnalyticaAI', downloads: '8.4k+', rating: '4.7', icon: Activity, type: '复盘汇报', installed: false, desc: '每周日自动将所有跑通的矩阵流水数据分析成可汇报的图表PPT发给负责人。' }
                            ].map((item, idx) => {
                               const IconComponent = item.icon;
                               return (
                               <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-[#685FAB]/50 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between overflow-hidden relative cursor-pointer">
                                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-zinc-50 to-transparent rounded-bl-full group-hover:from-[#685FAB]/5 transition-colors"></div>
                                  <div className="relative z-10">
                                     <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 group-hover:scale-110 group-hover:text-white group-hover:from-[#685FAB] group-hover:to-[#504886] group-hover:border-[#685FAB] transition-all shadow-sm">
                                           <IconComponent size={20} className="stroke-[2.5]" />
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                           <span className="text-[10px] font-bold bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded uppercase tracking-wide">{item.type}</span>
                                        </div>
                                     </div>
                                     <h3 className="text-[16px] font-bold text-zinc-900 mb-1.5">{item.name}</h3>
                                     <span className="text-[11px] font-bold text-zinc-400 mb-3 block">{item.author}</span>
                                     <p className="text-[12px] text-zinc-500 font-medium leading-relaxed mb-6">
                                        {item.desc}
                                     </p>
                                  </div>
                                  
                                  {/* Stats & Install */}
                                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between mt-auto relative z-10">
                                     <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-bold">
                                        <span className="flex items-center gap-1"><DownloadCloud size={12}/> {item.downloads}</span>
                                        <span className="flex items-center gap-1 text-yellow-500"><Star size={12} className="fill-current"/> {item.rating}</span>
                                     </div>
                                     {item.installed ? (
                                        <button className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1 border border-emerald-100 cursor-default shadow-sm">
                                           <Check size={14}/> 已安装
                                        </button>
                                     ) : (
                                        <button className="text-[12px] font-bold text-zinc-700 bg-zinc-100 group-hover:bg-[#685FAB] group-hover:text-white px-4 py-1.5 rounded-lg transition-colors shadow-sm">
                                            免费获取
                                        </button>
                                     )}
                                  </div>
                               </div>
                               );
                            })}
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
console.log("Successfully replaced SKILLS Section.");
