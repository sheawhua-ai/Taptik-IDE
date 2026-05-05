const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'App.tsx');
let code = fs.readFileSync(targetPath, 'utf8');

const returnStart = code.lastIndexOf('  return (\n    <div className="flex h-[100dvh]');
const componentEnd = code.lastIndexOf('  );\n}\n');

if (returnStart === -1 || componentEnd === -1) {
    console.error("Could not find start/end bounds.");
    process.exit(1);
}

// Prepare the new UI string
const UI_CODE = `  return (
    <div className="flex h-[100dvh] w-full bg-white text-zinc-900 font-sans overflow-hidden">
      {/* 1. Left Nav */}
      <div className="w-[80px] xl:w-[200px] border-r border-zinc-200 bg-[#fbfbfb] flex flex-col shrink-0 flex-none h-full relative z-20">
        <div className="h-16 flex items-center justify-center xl:justify-start xl:px-5 font-black text-lg tracking-tight text-zinc-900 gap-2 shrink-0">
          <div className="w-7 h-7 bg-[#605EA7] rounded-md flex items-center justify-center text-white shrink-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <Hexagon size={16} className="fill-current" />
          </div>
          <span className="hidden xl:block">TAPTIK</span>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto custom-scrollbar mt-2">
          {NAV_ITEMS.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveNav(item.id)}
              className={\`w-full flex items-center justify-center xl:justify-start gap-3 p-2 xl:px-3 xl:py-2.5 rounded-lg text-[13px] font-bold transition-all relative \${
                activeNav === item.id 
                  ? 'text-[#605EA7] bg-[#605EA7]/10' 
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }\`}
              title={item.name}
            >
              {activeNav === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#605EA7] rounded-r-full" />}
              <item.icon size={18} strokeWidth={activeNav === item.id ? 2.5 : 2} className="shrink-0" />
              <span className="hidden xl:block truncate">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 xl:p-4 border-t border-zinc-200 flex items-center justify-center xl:justify-start gap-2 shrink-0">
          <div className="w-8 h-8 xl:w-6 xl:h-6 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600 text-[10px] shrink-0">T</div>
          <span className="text-[11px] font-bold truncate text-zinc-600 hidden xl:block">admin</span>
          <LogOut size={14} className="ml-auto text-zinc-400 cursor-pointer hover:text-zinc-600 hidden xl:block shrink-0" title="退出" />
        </div>
      </div>

      {/* 2. Middle Pane (Expanded Content) */}
      <div className="flex-1 min-w-0 bg-[#fbfbfb] flex flex-col relative z-10 overflow-hidden border-r border-zinc-200">
        
        {/* FILES (项目资源) */}
        {activeNav === 'files' && (
          <div className="flex-1 flex h-full">
            <div className="w-[200px] xl:w-[240px] border-r border-zinc-200 bg-white flex flex-col shrink-0">
               <div className="p-4 border-b border-zinc-100 shrink-0">
                  <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-wide">资源目录</span>
               </div>
               <div className="flex-1 overflow-y-auto p-2 space-y-4">
                  <div>
                    <div className="px-3 py-1.5 text-[11px] font-bold text-zinc-400">商家项目 (独立隔离)</div>
                    <div className="space-y-0.5">
                       <div className="px-3 py-2 bg-[#F4ECF6] text-[#605EA7] rounded-lg text-[13px] font-bold cursor-pointer flex items-center gap-2">
                          <FolderOpen size={14} /> 商家A：宠物食品组
                       </div>
                       <div className="px-3 py-2 text-zinc-700 hover:bg-zinc-50 rounded-lg text-[13px] font-bold cursor-pointer flex items-center gap-2">
                          <FolderOpen size={14} className="text-zinc-400" /> 商家B：美妆旗舰店
                       </div>
                    </div>
                  </div>
                  <div>
                    <div className="px-3 py-1.5 text-[11px] font-bold text-zinc-400">全局资源</div>
                    <div className="space-y-0.5">
                       <div className="px-3 py-2 text-zinc-700 hover:bg-zinc-50 rounded-lg text-[13px] font-bold cursor-pointer flex items-center gap-2">
                          <Monitor size={14} className="text-zinc-400" /> 本地电脑文件 (全局)
                       </div>
                       <div className="px-3 py-2 text-zinc-700 hover:bg-zinc-50 rounded-lg text-[13px] font-bold cursor-pointer flex items-center gap-2">
                          <Cloud size={14} className="text-zinc-400" /> TAPTIK 云盘
                       </div>
                    </div>
                  </div>
               </div>
               <div className="p-3 border-t border-zinc-100 shrink-0">
                  <button className="w-full py-2 bg-[#605EA7]/5 text-[#605EA7] border border-[#605EA7]/20 rounded-lg text-[12px] font-bold hover:bg-[#605EA7]/10 transition-colors flex items-center justify-center gap-2">
                     <Plus size={14} /> 新增项目空间
                  </button>
               </div>
            </div>
            
            <div className="flex-1 flex flex-col bg-white min-w-0">
               <div className="p-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
                  <div className="flex flex-col">
                     <span className="text-[15px] font-bold text-zinc-900">商家A：宠物食品组</span>
                     <span className="text-[12px] text-zinc-500">24 个文件 · 1.2 GB</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                     <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-zinc-50 flex items-center gap-2">
                       <ArrowUpFromLine size={14} /> 上传本地文件
                     </button>
                     <button className="px-4 py-2 bg-[#605EA7] text-white rounded-lg text-[12px] font-bold shadow-sm hover:bg-[#4d4a8e] flex items-center gap-2">
                       <Cloud size={14} /> 一键同步到云端
                     </button>
                  </div>
               </div>
               <div className="flex-1 p-6 overflow-y-auto">
                  <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="border-b border-zinc-100 text-[12px] text-zinc-400 bg-zinc-50">
                              <th className="py-3 px-2 font-bold w-12 text-center"><input type="checkbox" className="rounded border-zinc-300" defaultChecked /></th>
                              <th className="py-3 px-4 font-bold">文件名称</th>
                              <th className="py-3 px-4 font-bold">大小</th>
                              <th className="py-3 px-4 font-bold">更新时间</th>
                              <th className="py-3 px-4 font-bold">状态</th>
                           </tr>
                        </thead>
                        <tbody className="text-[13px] text-zinc-700">
                           <tr className="border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer">
                              <td className="py-3 px-2 text-center"><input type="checkbox" className="rounded border-zinc-300" defaultChecked /></td>
                              <td className="py-3 px-4 flex items-center gap-2 font-medium truncate max-w-[200px]"><FileText size={14} className="text-blue-500 shrink-0" /> <span className="truncate">猫粮成分表分析.pdf</span></td>
                              <td className="py-3 px-4 text-zinc-500">2.4 MB</td>
                              <td className="py-3 px-4 text-zinc-500">今天 10:23</td>
                              <td className="py-3 px-4"><span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">已同步</span></td>
                           </tr>
                           <tr className="border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer">
                              <td className="py-3 px-2 text-center"><input type="checkbox" className="rounded border-zinc-300" defaultChecked /></td>
                              <td className="py-3 px-4 flex items-center gap-2 font-medium truncate max-w-[200px]"><ImageIcon size={14} className="text-orange-500 shrink-0" /> <span className="truncate">包装产品原图_1.png</span></td>
                              <td className="py-3 px-4 text-zinc-500">14.2 MB</td>
                              <td className="py-3 px-4 text-zinc-500">昨天 16:45</td>
                              <td className="py-3 px-4"><span className="text-[11px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">本地</span></td>
                           </tr>
                           <tr className="border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer">
                              <td className="py-3 px-2 text-center"><input type="checkbox" className="rounded border-zinc-300" /></td>
                              <td className="py-3 px-4 flex items-center gap-2 font-medium truncate max-w-[200px]"><FileSpreadsheet size={14} className="text-green-500 shrink-0" /> <span className="truncate">Q2销售数据总结.xlsx</span></td>
                              <td className="py-3 px-4 text-zinc-500">125 KB</td>
                              <td className="py-3 px-4 text-zinc-500">昨天 11:20</td>
                              <td className="py-3 px-4"><span className="text-[11px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">本地</span></td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* CONTENT (内容工坊) */}
        {activeNav === 'content' && (
          <div className="flex-1 flex flex-col h-full bg-[#fbfbfb]">
             <div className="p-6 border-b border-zinc-100 bg-white flex items-center justify-between shrink-0 shadow-sm relative z-10">
                <div>
                  <h1 className="text-2xl font-black text-zinc-900">内容工坊</h1>
                  <p className="text-[13px] text-zinc-500 font-medium mt-1">集中管理、审核和二次编辑所有 AI 聚合生成的图文资产</p>
                </div>
                <div className="flex items-center gap-2 bg-zinc-100 p-1.5 rounded-xl text-[13px] font-bold">
                   <button className="px-5 py-2 bg-white text-zinc-800 rounded-lg shadow-sm">全部内容</button>
                   <button className="px-5 py-2 text-zinc-500 hover:text-zinc-700">待优化 (3)</button>
                   <button className="px-5 py-2 text-zinc-500 hover:text-zinc-700">已定稿 (12)</button>
                </div>
             </div>
             <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {/* Content Card 1 */}
                <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:border-[#605EA7]/30 transition-colors group cursor-pointer flex flex-col">
                   <div className="h-40 bg-zinc-100 relative overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1548247661-3d7905940716?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="封面" />
                      <span className="absolute top-3 right-3 text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md">小红书图文</span>
                   </div>
                   <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-[15px] font-bold text-zinc-900 mb-2 leading-snug line-clamp-2 group-hover:text-[#605EA7] transition-colors">「新手养猫必看」这款主粮真的绝了！成分揭秘...</h3>
                      <p className="text-[13px] text-zinc-500 line-clamp-3 mb-5 font-medium leading-relaxed">今天给大家测评一款我最近发现的宝藏猫粮。作为资深铲屎官，最看重的就是配料表。这款采用了无谷低敏配方...</p>
                      <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4">
                         <span className="text-[11px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">待优化排版</span>
                         <button className="text-[12px] font-bold text-[#605EA7] bg-[#605EA7]/5 hover:bg-[#605EA7]/10 px-3 py-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100">进入编辑器</button>
                      </div>
                   </div>
                </div>
                
                {/* Content Card 2 */}
                <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:border-[#605EA7]/30 transition-colors group cursor-pointer flex flex-col">
                   <div className="h-40 bg-zinc-50 relative border-b border-zinc-100">
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                         <FileText size={48} className="text-zinc-200" />
                      </div>
                      <span className="absolute top-3 right-3 text-[11px] font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md">微信长文</span>
                   </div>
                   <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-[15px] font-bold text-zinc-900 mb-2 leading-snug line-clamp-2 group-hover:text-[#605EA7] transition-colors">双11宠物用品囤货节：教你如何薅羊毛最划算</h3>
                      <p className="text-[13px] text-zinc-500 line-clamp-3 mb-5 font-medium leading-relaxed">一年一度的双11又来了！宠物主人们准备好钱包了吗？今天整理了一份超全的省钱攻略，照着买绝对不吃亏...</p>
                      <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4">
                         <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">已定稿</span>
                         <button className="text-[12px] font-bold text-[#605EA7] bg-[#605EA7]/5 hover:bg-[#605EA7]/10 px-3 py-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100">进入编辑器</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* DATA (数据中心) */}
        {activeNav === 'data' && (
          <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto custom-scrollbar">
             <div className="p-6 xl:p-8 border-b border-zinc-100 shrink-0">
                <h1 className="text-2xl font-black text-zinc-900">数据中心</h1>
                <p className="text-[13px] text-zinc-500 font-medium mt-1">项目多维数据监控、笔记曝光转化与受众反馈深度解析</p>
             </div>
             
             <div className="p-6 xl:p-8 flex-1 space-y-8 bg-[#fbfbfb]">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                      <div className="text-[12px] font-bold text-zinc-500 mb-2 flex items-center justify-between">总曝光量 <Activity size={14} className="text-[#605EA7]" /></div>
                      <div className="text-2xl font-black text-zinc-900">12.5 W</div>
                      <div className="text-[11px] font-bold text-emerald-500 mt-2 flex items-center gap-1"><ArrowUp size={12}/> 12.4% 较上周</div>
                   </div>
                   <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                      <div className="text-[12px] font-bold text-zinc-500 mb-2 flex items-center justify-between">总互动数 <Component size={14} className="text-rose-500" /></div>
                      <div className="text-2xl font-black text-zinc-900">3,492</div>
                      <div className="text-[11px] font-bold text-emerald-500 mt-2 flex items-center gap-1"><ArrowUp size={12}/> 8.1% 较上周</div>
                   </div>
                   <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                      <div className="text-[12px] font-bold text-zinc-500 mb-2 flex items-center justify-between">引流转化 <Target size={14} className="text-blue-500" /></div>
                      <div className="text-2xl font-black text-zinc-900">845 人</div>
                      <div className="text-[11px] font-bold text-rose-500 mt-2 flex items-center gap-1"><ArrowUpFromLine size={12} className="rotate-180"/> 2.3% 较上周</div>
                   </div>
                   <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                      <div className="text-[12px] font-bold text-zinc-500 mb-2 flex items-center justify-between">新增评论 <MessageSquare size={14} className="text-orange-500" /></div>
                      <div className="text-2xl font-black text-zinc-900">412 条</div>
                      <div className="text-[11px] font-bold text-emerald-500 mt-2 flex items-center gap-1"><ArrowUp size={12}/> 21.5% 较上周</div>
                   </div>
                </div>

                {/* Sub Nav */}
                <div className="flex items-center gap-6 border-b border-zinc-200">
                   <button className="pb-3 text-[14px] font-bold text-[#605EA7] border-b-2 border-[#605EA7]">笔记数据排名</button>
                   <button className="pb-3 text-[14px] font-bold text-zinc-500 hover:text-zinc-800">观众评论洞察</button>
                   <button className="pb-3 text-[14px] font-bold text-zinc-500 hover:text-zinc-800">项目汇总趋势</button>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                   <table className="w-full text-left border-collapse">
                     <thead className="bg-zinc-50 border-b border-zinc-100">
                        <tr className="text-[12px] text-zinc-500">
                           <th className="py-4 px-5 font-bold">笔记内容标题</th>
                           <th className="py-4 px-5 font-bold">分发渠道</th>
                           <th className="py-4 px-5 font-bold text-right">阅读量</th>
                           <th className="py-4 px-5 font-bold text-right">互动率</th>
                           <th className="py-4 px-5 font-bold text-right">获取线索</th>
                        </tr>
                     </thead>
                     <tbody className="text-[13px] text-zinc-800 font-medium">
                        <tr className="border-b border-zinc-50 hover:bg-zinc-50">
                           <td className="py-4 px-5 font-bold text-zinc-900 max-w-[200px] truncate">「新手养猫必看」这款主粮真的绝了！</td>
                           <td className="py-4 px-5"><span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md border border-red-100">小红书</span></td>
                           <td className="py-4 px-5 text-right font-mono text-[14px]">45,210</td>
                           <td className="py-4 px-5 text-right text-emerald-600 font-bold">8.4%</td>
                           <td className="py-4 px-5 text-right font-bold text-[14px]">124</td>
                        </tr>
                        <tr className="border-b border-zinc-50 hover:bg-zinc-50">
                           <td className="py-4 px-5 font-bold text-zinc-900 max-w-[200px] truncate">双11宠物用品囤货节攻略</td>
                           <td className="py-4 px-5"><span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">微信公众号</span></td>
                           <td className="py-4 px-5 text-right font-mono text-[14px]">12,400</td>
                           <td className="py-4 px-5 text-right text-zinc-600 font-bold">3.2%</td>
                           <td className="py-4 px-5 text-right font-bold text-[14px]">45</td>
                        </tr>
                     </tbody>
                   </table>
                </div>

                {/* Comment Analysis Preview */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                   <h3 className="text-[16px] font-black text-zinc-900 mb-5 flex items-center gap-2"><Brain size={18} className="text-[#605EA7]"/> AI 评论情感与关键词提取</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                         <div className="text-[12px] font-bold text-zinc-500">受众高频关注词云</div>
                         <div className="flex flex-wrap gap-2.5">
                            <span className="px-3.5 py-1.5 bg-zinc-100 text-zinc-800 text-[13px] font-bold rounded-lg hover:border-zinc-300 border border-transparent cursor-pointer transition-colors">配料表 (142次)</span>
                            <span className="px-3.5 py-1.5 bg-zinc-100 text-zinc-800 text-[13px] font-bold rounded-lg hover:border-zinc-300 border border-transparent cursor-pointer transition-colors">性价比 (98次)</span>
                            <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-[13px] font-bold rounded-lg border border-emerald-100">多肉发腮 (84次)</span>
                            <span className="px-3.5 py-1.5 bg-rose-50 text-rose-700 text-[13px] font-bold rounded-lg border border-rose-100">价格刺客 (35次)</span>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="text-[12px] font-bold text-zinc-500">自动研判正负向情感</div>
                         <div className="h-8 w-full rounded-xl overflow-hidden flex bg-zinc-100 shadow-inner">
                            <div className="h-full bg-emerald-500 w-[75%]" title="正面 75%"></div>
                            <div className="h-full bg-zinc-300 w-[15%]" title="中性 15%"></div>
                            <div className="h-full bg-rose-400 w-[10%]" title="负面 10%"></div>
                         </div>
                         <div className="flex justify-between text-[12px] font-bold">
                            <span className="text-emerald-600 flex items-center gap-1"><ArrowUp size={14}/> 正面 75%</span>
                            <span className="text-zinc-500 flex items-center gap-1"><ArrowUpFromLine size={14} className="rotate-90"/> 中性 15%</span>
                            <span className="text-rose-500 flex items-center gap-1"><ArrowUp size={14} className="rotate-180"/> 负面 10%</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* SETTINGS (系统配置) */}
        {activeNav === 'settings' && (
          <div className="flex-1 flex flex-col h-full bg-[#fbfbfb] overflow-y-auto custom-scrollbar">
             <div className="p-6 xl:px-8 border-b border-zinc-200 bg-white shrink-0 shadow-sm relative z-10">
                 <h1 className="text-2xl font-black text-zinc-900">系统全局配置</h1>
                 <p className="text-[13px] text-zinc-500 font-medium mt-1">管理商家隔离账号、三方自动化爬虫授权以及数据回调 API。</p>
             </div>
             
             <div className="flex-1 p-6 xl:p-8 max-w-4xl space-y-8">
                 {/* 商家账号管理 */}
                 <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:border-[#605EA7]/30 transition-colors">
                    <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                       <h2 className="text-[15px] font-bold text-zinc-900 flex items-center gap-2"><Building2 size={16} className="text-[#605EA7]"/> 商家/项目隔离授权</h2>
                       <button className="text-[12px] font-bold text-white bg-[#605EA7] hover:bg-[#4d4a8e] px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-1">
                          <Plus size={14}/> 新增商家组
                       </button>
                    </div>
                    <div className="p-5 space-y-4">
                       {[
                         { name: '商家A：宠物食品组', admin: 'zhangsan@pet.com', initial: '商A' },
                         { name: '商家B：美妆旗舰店', admin: 'lisi@beauty.com', initial: '商B' }
                       ].map(acc => (
                         <div key={acc.initial} className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl hover:border-[#605EA7]/30 transition-colors bg-white">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-full bg-[#fbfbfb] border border-zinc-200 flex items-center justify-center text-zinc-500 font-bold text-[15px]">{acc.initial}</div>
                               <div>
                                 <div className="text-[14px] font-bold text-zinc-900">{acc.name}</div>
                                 <div className="text-[12px] text-zinc-500 mt-1">云端管理员：{acc.admin}</div>
                               </div>
                            </div>
                            <div className="flex items-center gap-4">
                               <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">授权正常</span>
                               <button className="text-[13px] font-bold text-zinc-500 hover:text-[#605EA7] transition-colors border border-zinc-200 hover:border-[#605EA7]/30 px-4 py-2 rounded-lg bg-white shadow-sm">编辑策略</button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* 爬虫与自动化授权 */}
                 <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:border-[#605EA7]/30 transition-colors">
                    <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                       <h2 className="text-[15px] font-bold text-zinc-900 flex items-center gap-2"><Bot size={16} className="text-[#605EA7]"/> 数据抓取与自动化矩阵号</h2>
                       <p className="text-[12px] text-zinc-500 mt-1">配置用于收集竞品数据、抓取热搜和回传评论的专属授权（请确保合规获取凭证）。</p>
                    </div>
                    <div className="p-5 space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-zinc-100 pb-6">
                          <div className="space-y-3">
                             <label className="text-[13px] font-bold text-zinc-800 flex items-center gap-2">小红书爬虫节点 Cookie</label>
                             <textarea placeholder="输入从浏览器抓包提取的 Cookie..." className="w-full h-28 p-3 border border-zinc-200 rounded-xl text-[12px] bg-zinc-50 focus:bg-white focus:outline-none focus:border-[#605EA7] focus:ring-1 focus:ring-[#605EA7]/20 transition-all font-mono resize-none"></textarea>
                          </div>
                          <div className="space-y-3">
                             <label className="text-[13px] font-bold text-zinc-800 flex items-center gap-2">微信公号自动化 Token</label>
                             <input type="password" placeholder="••••••••••••••••" className="w-full p-3 border border-zinc-200 rounded-xl text-[13px] bg-zinc-50 focus:bg-white focus:outline-none focus:border-[#605EA7] focus:ring-1 focus:ring-[#605EA7]/20 transition-all font-mono" />
                             <p className="text-[11px] text-zinc-400 font-bold mt-2">用于自动化回传阅读量、赞赏数据及自动回复脚本</p>
                          </div>
                       </div>
                       <div className="flex justify-end">
                          <button className="text-[13px] font-bold text-white bg-[#18181b] hover:bg-[#605EA7] px-6 py-2.5 rounded-xl shadow-sm transition-colors">
                             保存授权凭证
                          </button>
                       </div>
                    </div>
                 </div>

                 {/* 数据回调与 Webhook */}
                 <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:border-[#605EA7]/30 transition-colors">
                    <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                       <h2 className="text-[15px] font-bold text-zinc-900 flex items-center gap-2"><Target size={16} className="text-[#605EA7]"/> 线索回调 Webhook</h2>
                       <p className="text-[12px] text-zinc-500 mt-1">将系统中捕获到的意向留资自动推送到贵司自有 CRM 数据库</p>
                    </div>
                    <div className="p-6 flex flex-col gap-5">
                       <div className="flex gap-4 items-center">
                          <span className="w-28 text-[13px] font-bold text-zinc-700">引流线索到达</span>
                          <input type="text" placeholder="https://api.yourdomain.com/webhook/leads" className="flex-1 p-3 border border-zinc-200 rounded-xl text-[13px] bg-zinc-50 focus:bg-white focus:outline-none focus:border-[#605EA7] transition-all" />
                          <button className="px-4 py-3 border border-zinc-200 rounded-xl text-zinc-600 hover:text-[#605EA7] hover:border-[#605EA7]/30 font-bold text-[13px] transition-colors shadow-sm bg-white">PING 测试</button>
                       </div>
                    </div>
                 </div>
             </div>
          </div>
        )}

        {/* PUBLISH (发布分发) - Kept from original, adapted slightly */}
        {activeNav === 'publish' && (
          <div className="flex-1 flex h-full">
             <div className="w-[200px] xl:w-[240px] border-r border-zinc-200 bg-white flex flex-col shrink-0">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                   <span className="text-[12px] font-bold text-zinc-500">分发中心 · 项目方案</span>
                   <button className="text-zinc-400 hover:text-[#605EA7] transition-colors"><Plus size={14}/></button>
                </div>
                <div className="flex flex-col">
                   {[
                     { id: '1', title: '618 爆发期内容池', sub: '系统智能创建', active: activePlanId === '1' },
                     { id: '2', title: '秋冬品类焕新预热', sub: '女装-大衣-毛呢', active: activePlanId === '2' },
                     { id: '3', title: '矩阵号扩量测试 (A组)', sub: '手动创建', active: activePlanId === '3' }
                   ].map(plan => (
                      <div key={plan.id} onClick={() => setActivePlanId(plan.id)} className={\`p-4 border-b border-zinc-100 cursor-pointer \${plan.active ? 'bg-[#F4ECF6] border-l-4 border-l-[#605EA7]' : 'hover:bg-zinc-50 border-l-4 border-l-transparent'}\`}>
                         <div className={\`text-[13px] font-bold \${plan.active ? 'text-[#605EA7]' : 'text-zinc-700'}\`}>{plan.title}</div>
                         <div className="text-[12px] text-zinc-400 mt-1 line-clamp-1">{plan.sub}</div>
                      </div>
                   ))}
                </div>
             </div>
             <div className="flex-1 flex flex-col items-center bg-[#fbfbfb] overflow-y-auto custom-scrollbar">
               <div className="p-6 xl:p-8 w-full max-w-4xl space-y-6">
                  <div className="mb-4">
                     <h1 className="text-2xl font-black text-zinc-900 border-b-2 border-[#605EA7] pb-2 inline-block">发布与配置管理</h1>
                     <p className="text-[13px] text-zinc-500 font-medium mt-2">为当前内容方案配置 TapTik 落地页矩阵与授权策略，并提取核心分发链接</p>
                  </div>

                  <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-[#605EA7]/30 transition-colors">
                     <div className="absolute top-0 left-0 w-1 p-0 transition-all h-full bg-[#605EA7] opacity-60 group-hover:opacity-100" />
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-[#F4ECF6] text-[#605EA7] rounded-xl flex items-center justify-center">
                              <LayoutTemplate size={20} />
                           </div>
                           <div>
                              <h2 className="text-[15px] font-bold text-zinc-900">落地页统一配置</h2>
                           </div>
                        </div>
                        <button className="bg-[#18181b] hover:bg-[#605EA7] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-sm transition-colors hidden xl:block">保存全局</button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                        <div className="flex flex-col gap-2">
                           <label className="text-[12px] font-bold text-zinc-700 flex items-center gap-2"><ImageIcon size={14} className="text-zinc-400"/> 落地页分享海报</label>
                           <input type="text" placeholder="留空则自动抓取" className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-[#605EA7] transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-[12px] font-bold text-zinc-700 flex items-center gap-2"><Users size={14} className="text-zinc-400"/> 微信授权策略</label>
                           <select className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-[#605EA7] outline-none font-medium text-zinc-800">
                              <option>公开浏览模式</option>
                              <option>强制静默授权截留</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  {/* Tracking link table */}
                  <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm group hover:border-[#605EA7]/30 transition-colors">
                     <h2 className="text-[15px] font-bold text-zinc-900 flex items-center gap-2 mb-4"><Link2 size={16} className="text-[#605EA7]"/> 渠道追踪矩阵</h2>
                     <div className="border border-zinc-100 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                           <thead className="bg-zinc-50 border-b border-zinc-100">
                              <tr className="text-[12px] text-zinc-500">
                                 <th className="py-3 px-4 font-bold">提链分组</th>
                                 <th className="py-3 px-4 font-bold">归属参数 (CID)</th>
                                 <th className="py-3 px-4 font-bold text-right">操作</th>
                              </tr>
                           </thead>
                           <tbody className="text-[13px] text-zinc-800 font-medium">
                              <tr className="border-b border-zinc-50">
                                 <td className="py-3 px-4">测试投放A组 <span className="bg-emerald-50 text-emerald-600 text-[10px] px-1.5 rounded-md ml-1 border border-emerald-100">已部署</span></td>
                                 <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">wx_gzh_a</td>
                                 <td className="py-3 px-4 text-right"><button className="text-[12px] font-bold text-[#605EA7] bg-[#605EA7]/5 hover:bg-[#605EA7]/10 px-3 py-1.5 rounded-lg transition-colors">复制 URL</button></td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
             </div>
          </div>
        )}
        
        {/* SKILLS */}
        {activeNav === 'skills' && (
          <div className="flex-1 flex flex-col h-full bg-[#fbfbfb]">
             <div className="p-6 xl:px-8 border-b border-zinc-200 bg-white shadow-sm shrink-0 flex justify-between items-center z-10">
                <h1 className="text-2xl font-black text-zinc-900">官方与生态组件库</h1>
                <div className="flex items-center bg-zinc-100 rounded-lg p-1 text-[13px] font-bold">
                   <button className="px-4 py-1.5 rounded-md shadow-sm bg-white text-zinc-800">全部工作流</button>
                   <button className="px-4 py-1.5 rounded-md text-zinc-500 hover:text-zinc-700">我创建的</button>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-6 xl:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
                   <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-[#605EA7]/30 transition-all cursor-pointer">
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md mb-3 inline-block">内容创作</span>
                      <h3 className="text-[16px] font-bold text-zinc-900 mb-2">爆款笔记生成引擎</h3>
                      <p className="text-[13px] text-zinc-500 font-medium leading-relaxed mb-4">基于用户提供的产品卖点直接生成小红书爆款图文模板。</p>
                      <button className="text-[12px] font-bold text-[#605EA7] bg-[#605EA7]/5 hover:bg-[#605EA7]/10 px-4 py-2 w-full rounded-xl transition-colors">从工作区调用该能力</button>
                   </div>
                   <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-[#605EA7]/30 transition-all cursor-pointer">
                      <span className="text-[11px] font-bold text-purple-600 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-md mb-3 inline-block flex items-center gap-1 w-fit"><TerminalSquare size={12}/> 自建插件</span>
                      <h3 className="text-[16px] font-bold text-zinc-900 mb-2">竞品标题分析器</h3>
                      <p className="text-[13px] text-zinc-500 font-medium leading-relaxed mb-4">爬取行业最新最热文章标题，深度分析公式并给出仿写建议。</p>
                      <button className="text-[12px] font-bold text-zinc-500 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 px-4 py-2 w-full rounded-xl transition-colors">配置爬虫抓取逻辑</button>
                   </div>
                </div>
             </div>
          </div>
        )}

      </div>

      {/* 3. Right Pane - Permanent Chat Workspace */}
      <div className="w-[380px] xl:w-[450px] flex-none bg-white border-l border-zinc-200 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] flex flex-col z-30 relative shrink-0">
          <div className="h-16 flex items-center justify-between px-5 border-b border-zinc-100 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-[#F4ECF6] text-[#605EA7] rounded-lg">
                <Bot size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-zinc-900 leading-tight">TAPTIK 辅助引擎</span>
                <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> 待命中</span>
              </div>
            </div>
            <button onClick={() => setMessages([])} className="p-2 border border-zinc-200 rounded-md text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-colors bg-white">
              <RotateCw size={14}/>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 relative" onDragOver={handleChatDragOver} onDragLeave={handleChatDragLeave} onDrop={handleChatDrop}>
             {isGlobalDragging && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={\`absolute inset-0 z-50 flex items-center justify-center m-2 rounded-xl border-2 transition-colors backdrop-blur-[1px] \${isDragHoveringChat ? 'border-[#605EA7] bg-[#605EA7]/5' : 'border-dashed border-[#605EA7]/30 bg-[#605EA7]/5'}\`}>
                    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg border border-zinc-100 pointer-events-none">
                       {isDragHoveringChat ? <ArrowUp size={24} className="text-[#605EA7] mb-2 animate-bounce" /> : <PlusCircle size={24} className="text-[#605EA7] mb-2" />}
                       <span className="text-[13px] font-bold text-[#605EA7]">{isDragHoveringChat ? '松开以装载资产' : '拖放至此插入上下文'}</span>
                    </div>
                 </motion.div>
             )}

             {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center">
                   <div className="w-12 h-12 bg-[#F4ECF6] text-[#605EA7] rounded-xl flex items-center justify-center mb-4">
                      <Zap size={24} className="fill-current opacity-80" />
                   </div>
                   <h2 className="text-lg font-black text-zinc-900 mb-1">您好，管理员</h2>
                   <p className="text-[12px] font-medium text-zinc-500 mb-6 text-center">这是一个常驻工作区，您可以随时调用 AI</p>

                   <div className="w-full space-y-2">
                       <button onClick={() => insertMention('内容方案AI策划', '@')} className="w-full text-left bg-zinc-50 hover:bg-[#605EA7]/10 p-3 rounded-xl border border-zinc-200 hover:border-[#605EA7]/30 transition-all group flex items-center justify-between">
                         <div>
                            <div className="text-[12px] font-bold text-zinc-800 group-hover:text-[#605EA7] transition-colors flex items-center gap-1"><Component size={12}/> 帮我策划新方案</div>
                         </div>
                         <ArrowRight size={14} className="text-zinc-400 group-hover:text-[#605EA7]" />
                       </button>
                       <button onClick={() => insertMention('爆款笔记批量生成', '@')} className="w-full text-left bg-zinc-50 hover:bg-[#605EA7]/10 p-3 rounded-xl border border-zinc-200 hover:border-[#605EA7]/30 transition-all group flex items-center justify-between">
                         <div>
                            <div className="text-[12px] font-bold text-zinc-800 group-hover:text-[#605EA7] transition-colors flex items-center gap-1"><Component size={12}/> 基于历史生成新笔记</div>
                         </div>
                         <ArrowRight size={14} className="text-zinc-400 group-hover:text-[#605EA7]" />
                       </button>
                   </div>
                </div>
             ) : (
                <div className="space-y-4 pb-2">
                   {messages.map((msg, idx) => (
                     <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={\`flex flex-col \${msg.role === 'user' ? 'items-end' : 'items-start'}\`}>
                       {msg.role === 'user' ? (
                         <div className="flex flex-col items-end max-w-[90%]">
                            <div className="px-4 py-3 rounded-2xl bg-[#18181b] text-[#f1f1f4] border border-zinc-800 shadow-md rounded-br-sm text-[13px] leading-relaxed font-medium break-words max-w-full">{renderMessageContent(msg.content as string, msg.role)}</div>
                         </div>
                       ) : (
                         <div className="max-w-[95%]">
                            <div className="flex items-center gap-2 mb-1.5 px-1">
                               <div className={\`w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-sm \${msg.role === 'system' ? 'bg-[#CEC8E2] text-[#605EA7]' : 'bg-[#605EA7]'}\`}>
                                  {msg.role === 'system' ? 'SYS' : 'AI'}
                               </div>
                               <span className="text-[10px] font-bold text-zinc-500 tracking-wide">{msg.role === 'system' ? '系统提示' : 'TAPTIK 引擎'}</span>
                            </div>
                            <div className={\`px-4 py-3 rounded-2xl bg-white border border-zinc-200 shadow-sm text-[13px] text-zinc-800 leading-relaxed rounded-bl-sm font-medium \${msg.role === 'system' ? 'bg-zinc-50/80 text-zinc-600 border-dashed' : ''} break-words max-w-full\`}>{renderMessageContent(msg.content as string, msg.role)}</div>
                         </div>
                       )}
                     </motion.div>
                   ))}
                   <div ref={chatEndRef} />
                </div>
             )}
          </div>

          <div className="p-4 pt-2 shrink-0 border-t border-zinc-100 bg-white">
             {showMentionMenu && (
                 <div className="absolute bottom-full left-4 mb-2 w-[calc(100%-2rem)] bg-white border border-zinc-200 shadow-xl rounded-xl z-50 overflow-hidden flex flex-col max-h-48">
                    <div className="px-3 py-2 text-[10px] uppercase font-bold text-zinc-400 border-b border-zinc-100 bg-zinc-50">可用工作流库</div>
                    <div className="overflow-y-auto w-full flex-1 p-1 custom-scrollbar">
                       <div onClick={() => insertMention('爆款笔记批量生成', '@')} className="px-3 py-2 flex items-center gap-2 hover:bg-[#605EA7]/10 hover:text-[#605EA7] rounded-lg cursor-pointer text-[12px] font-bold text-zinc-700">
                          <Component size={12} />爆款笔记批量生成
                       </div>
                       <div onClick={() => insertMention('内容方案AI策划', '@')} className="px-3 py-2 flex items-center gap-2 hover:bg-[#605EA7]/10 hover:text-[#605EA7] rounded-lg cursor-pointer text-[12px] font-bold text-zinc-700">
                          <Component size={12} />内容方案 AI 策划
                       </div>
                    </div>
                 </div>
             )}
             <div className="bg-zinc-50/80 rounded-xl border border-zinc-200 flex relative focus-within:border-[#605EA7]/50 focus-within:bg-white focus-within:shadow-sm transition-all px-1 py-1">
               <textarea 
                  rows={2}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="输入指令 / @调用Skill..."
                  className="flex-1 max-h-32 min-h-[44px] py-3 pl-3 pr-10 resize-none bg-transparent text-[13px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
               />
               <div className="absolute right-2 bottom-2">
                  <button 
                     onClick={handleSend}
                     disabled={!inputValue.trim()}
                     className="w-8 h-8 rounded-[10px] bg-[#605EA7] hover:bg-[#4d4a8e] disabled:bg-zinc-200 disabled:text-zinc-400 text-white flex items-center justify-center transition-all disabled:opacity-50"
                  >
                     <ArrowUp size={16} strokeWidth={2.5} />
                  </button>
               </div>
             </div>
          </div>
      </div>
    </div>
  );
}
`;

code = code.substring(0, returnStart) + UI_CODE;
fs.writeFileSync(targetPath, code);
console.log('Successfully updated UI!');
