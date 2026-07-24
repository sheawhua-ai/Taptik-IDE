import fs from 'fs';

let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

// 1. Add showCreateWizard state
content = content.replace(
  'const [detailTab, setDetailTab] = useState<"总览" | "策略与计划" | "内容与素材" | "发布与互动" | "变更记录">("总览");',
  `const [detailTab, setDetailTab] = useState<"总览" | "策略与计划" | "内容与素材" | "发布与互动" | "变更记录">("总览");\n  const [showCreateWizard, setShowCreateWizard] = useState(false);\n  const [createStep, setCreateStep] = useState(1);`
);

// 2. Attach onClick to Plus button
content = content.replace(
  '<button className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-sm transition-all" title="开启新一轮">',
  '<button onClick={() => setShowCreateWizard(true)} className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-sm transition-all" title="开启新一轮">'
);

// 3. Middle Workspace modification to handle showCreateWizard
const createWizardUI = `
        {showCreateWizard ? (
          <div className="flex-1 flex flex-col min-w-0 bg-white relative">
            <div className="px-8 py-5 border-b border-neutral-200 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowCreateWizard(false)} className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-[20px] font-bold text-neutral-900">开启新一轮项目</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-[#fcfcfc]">
              <div className="max-w-2xl mx-auto space-y-8">
                {createStep === 1 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div>
                      <h3 className="text-[18px] font-bold text-neutral-900 mb-2">描述你的业务目标或痛点</h3>
                      <p className="text-[13px] text-neutral-500 mb-4">自然语言输入，AI 将为你推荐合适的策略组合和执行计划。</p>
                      <textarea 
                        className="w-full h-32 p-4 bg-white border border-neutral-200 rounded-2xl text-[14px] outline-none focus:border-primary-500 resize-none shadow-sm"
                        placeholder="例如：618大促即将到来，我想针对肠胃敏感的幼犬推广我们的益生菌烘焙粮，希望获取更多新客线索..."
                      ></textarea>
                    </div>
                    <div>
                       <h4 className="text-[14px] font-bold text-neutral-900 mb-3">或者从近期洞察中选择：</h4>
                       <div className="space-y-2">
                         <div className="p-4 bg-white border border-neutral-200 rounded-xl cursor-pointer hover:border-primary-400 transition-colors shadow-sm">
                           <div className="flex items-center justify-between mb-1">
                             <div className="text-[14px] font-bold text-neutral-900">近期流失客户挽回</div>
                             <span className="text-[10px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded border border-primary-100">高优先级</span>
                           </div>
                           <div className="text-[12px] text-neutral-500">检测到过去30天有批量的幼犬粮订阅取消。</div>
                         </div>
                         <div className="p-4 bg-white border border-neutral-200 rounded-xl cursor-pointer hover:border-primary-400 transition-colors shadow-sm">
                           <div className="flex items-center justify-between mb-1">
                             <div className="text-[14px] font-bold text-neutral-900">竞品爆款拦截</div>
                           </div>
                           <div className="text-[12px] text-neutral-500">竞品A的“无谷防敏”系列近期搜索量激增。</div>
                         </div>
                       </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button onClick={() => setCreateStep(2)} className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2">
                        下一步：让 AI 分析 <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {createStep === 2 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="flex items-center gap-3 text-primary-600 mb-6">
                      <Sparkles size={24} />
                      <h3 className="text-[18px] font-bold text-neutral-900">AI 已为你生成备选策略</h3>
                    </div>
                    
                    <div className="grid gap-4">
                      <div className="p-5 bg-white border-2 border-primary-500 rounded-2xl shadow-sm relative cursor-pointer">
                        <div className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">推荐</div>
                        <h4 className="text-[16px] font-bold text-neutral-900 mb-2">知识科普与试吃转化</h4>
                        <p className="text-[13px] text-neutral-600 mb-4">通过痛点科普吸引精准用户，配合评论区低门槛试吃活动，快速积累意向客户池。</p>
                        <div className="grid grid-cols-3 gap-4 text-[12px]">
                          <div><div className="text-neutral-400 mb-1">预计周期</div><div className="font-medium">14天</div></div>
                          <div><div className="text-neutral-400 mb-1">内容规模</div><div className="font-medium">15篇图文</div></div>
                          <div><div className="text-neutral-400 mb-1">执行难度</div><div className="font-medium text-emerald-600">中等</div></div>
                        </div>
                      </div>

                      <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:border-neutral-300 cursor-pointer transition-colors">
                        <h4 className="text-[16px] font-bold text-neutral-900 mb-2">直接搜索卡位</h4>
                        <p className="text-[13px] text-neutral-600 mb-4">高密度铺设针对“幼犬软便”的测评内容，抢占搜索结果页。</p>
                        <div className="grid grid-cols-3 gap-4 text-[12px]">
                          <div><div className="text-neutral-400 mb-1">预计周期</div><div className="font-medium">30天</div></div>
                          <div><div className="text-neutral-400 mb-1">内容规模</div><div className="font-medium">50篇图文</div></div>
                          <div><div className="text-neutral-400 mb-1">执行难度</div><div className="font-medium text-amber-600">较高</div></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-6 border-t border-neutral-100">
                      <button onClick={() => setCreateStep(1)} className="px-4 py-2 text-neutral-500 hover:text-neutral-900 text-[13px] font-bold">返回修改</button>
                      <button onClick={() => { setShowCreateWizard(false); setCreateStep(1); }} className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors">
                        使用此策略生成立项草案
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-w-0 bg-white relative">
            {/* Workspace Header */}
`;

content = content.replace(
  '<div className="flex-1 flex flex-col min-w-0 bg-white relative">',
  createWizardUI
);

// 4. Implement missing tabs content
const tabsImplementation = `
          {detailTab === "策略与计划" && (
            <div className="max-w-4xl mx-auto space-y-6">
               <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-[16px] font-bold text-neutral-900 mb-4">策略大纲</h3>
                  <div className="space-y-4 text-[13px] text-neutral-700">
                    <div><span className="font-bold text-neutral-900 block mb-1">目标人群：</span>缺乏养宠经验，对幼犬肠胃敏感焦虑的新手宠物主。</div>
                    <div><span className="font-bold text-neutral-900 block mb-1">核心卖点表达：</span>突出“易消化”、“烘焙工艺不油腻”、“含益生菌”。避免生硬说教，采用过来人分享口吻。</div>
                    <div><span className="font-bold text-neutral-900 block mb-1">转化路径：</span>正文埋钩子（如“我家狗换这个后便便成型了”） -> 评论区置顶分享双11/试吃装获取方式 -> 引导私信发送专属优惠券。</div>
                  </div>
               </div>
               
               <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-[16px] font-bold text-neutral-900 mb-4">阶段计划</h3>
                  <div className="relative border-l-2 border-neutral-100 ml-3 space-y-6">
                     <div className="relative pl-6">
                       <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white" />
                       <h4 className="text-[14px] font-bold text-neutral-900">阶段一：内容铺设与搜索卡位</h4>
                       <p className="text-[12px] text-neutral-500 mb-2">2026.07.01 - 2026.07.10</p>
                       <p className="text-[13px] text-neutral-600">完成首批15篇笔记发布，覆盖“幼犬换粮”、“软便”等核心搜索词。</p>
                     </div>
                     <div className="relative pl-6">
                       <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary-500 ring-4 ring-white" />
                       <h4 className="text-[14px] font-bold text-neutral-900">阶段二：互动维护与线索收割</h4>
                       <p className="text-[12px] text-neutral-500 mb-2">2026.07.11 - 2026.07.20</p>
                       <p className="text-[13px] text-neutral-600">重点监控评论区，使用店长号及时回复痛点问题，引导添加企微发送试吃装。</p>
                     </div>
                  </div>
               </div>
            </div>
          )}
          {detailTab === "内容与素材" && (
            <div className="max-w-5xl mx-auto space-y-6">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="text-[16px] font-bold text-neutral-900">执行批次：第一批分发</h3>
                 <button className="text-[13px] font-bold text-primary-600 hover:text-primary-700">进入素材中心</button>
               </div>
               <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                 <table className="w-full text-left text-[13px]">
                   <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                     <tr>
                       <th className="px-4 py-3 font-medium">内容标题</th>
                       <th className="px-4 py-3 font-medium">文案状态</th>
                       <th className="px-4 py-3 font-medium">素材位要求</th>
                       <th className="px-4 py-3 font-medium">素材满足度</th>
                       <th className="px-4 py-3 font-medium text-right">操作</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-neutral-100">
                     {[1,2,3].map(i => (
                       <tr key={i} className="hover:bg-neutral-50">
                         <td className="px-4 py-3 font-medium text-neutral-900">换粮期幼犬怎么吃不拉稀？</td>
                         <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-700">已定稿</span></td>
                         <td className="px-4 py-3 text-neutral-600">首图(狗+粮) + 3张细节图</td>
                         <td className="px-4 py-3">
                           <div className="flex items-center gap-2">
                             <div className="h-1.5 w-16 bg-emerald-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-full" /></div>
                             <span className="text-[11px] text-emerald-700">4/4</span>
                           </div>
                         </td>
                         <td className="px-4 py-3 text-right">
                           <button className="text-primary-600 font-medium hover:underline">预览</button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}
          {detailTab === "发布与互动" && (
            <div className="max-w-5xl mx-auto space-y-6">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="text-[16px] font-bold text-neutral-900">发布任务清单</h3>
                 <button className="text-[13px] font-bold text-primary-600 hover:text-primary-700">进入执行中心处理异常</button>
               </div>
               <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                 <table className="w-full text-left text-[13px]">
                   <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                     <tr>
                       <th className="px-4 py-3 font-medium">内容</th>
                       <th className="px-4 py-3 font-medium">发布账号</th>
                       <th className="px-4 py-3 font-medium">状态</th>
                       <th className="px-4 py-3 font-medium">数据</th>
                       <th className="px-4 py-3 font-medium text-right">笔记链接</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-neutral-100">
                     <tr className="hover:bg-neutral-50">
                       <td className="px-4 py-3 font-medium text-neutral-900 truncate max-w-[200px]">换粮期幼犬怎么吃不拉稀？</td>
                       <td className="px-4 py-3 text-neutral-600">小红书-店长A</td>
                       <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[11px] bg-red-50 text-red-700 border border-red-100">发布异常</span></td>
                       <td className="px-4 py-3 text-neutral-400">-</td>
                       <td className="px-4 py-3 text-right"><button onClick={() => setDrawerType("handle_anomaly")} className="text-red-600 font-medium hover:underline">处理</button></td>
                     </tr>
                     <tr className="hover:bg-neutral-50">
                       <td className="px-4 py-3 font-medium text-neutral-900 truncate max-w-[200px]">千万别给幼犬乱喂益生菌！</td>
                       <td className="px-4 py-3 text-neutral-600">小红书-店长B</td>
                       <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100">已发布</span></td>
                       <td className="px-4 py-3 text-neutral-600">👁 1.2k &nbsp; ❤️ 45</td>
                       <td className="px-4 py-3 text-right"><a href="#" className="text-primary-600 font-medium hover:underline">查看笔记</a></td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </div>
          )}
          {detailTab === "变更记录" && (
            <div className="max-w-4xl mx-auto space-y-6">
               <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                  <div className="space-y-6 border-l-2 border-neutral-100 ml-3">
                     <div className="relative pl-6">
                       <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-neutral-200 ring-4 ring-white" />
                       <div className="text-[12px] text-neutral-400 mb-1">2026-07-22 10:30 • 张操盘</div>
                       <div className="text-[14px] font-bold text-neutral-900 mb-1">调整了发布安排</div>
                       <p className="text-[13px] text-neutral-600">将“小红书-店长A”的发布方式从【操盘手人工发布】修改为【员工手机人工发布】。</p>
                     </div>
                     <div className="relative pl-6">
                       <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-neutral-200 ring-4 ring-white" />
                       <div className="text-[12px] text-neutral-400 mb-1">2026-07-20 15:00 • AI 助手</div>
                       <div className="text-[14px] font-bold text-neutral-900 mb-1">确认本轮策略并立项</div>
                       <p className="text-[13px] text-neutral-600">根据需求生成了“直接搜索卡位”策略，并创建正式项目。</p>
                     </div>
                  </div>
               </div>
            </div>
          )}`;

content = content.replace(
  /\{\s*detailTab === "策略与计划" && \([\s\S]*?\{\s*detailTab === "变更记录" && \([\s\S]*?\)\s*\}/,
  tabsImplementation
);
// Match to closing brace of the last div block.
content = content + "\n"; // Just to be safe for regex parsing

// We have one last closing block to insert
content = content.replace(
  '          {detailTab === "策略与计划" && (',
  tabsImplementation.split('{detailTab === "策略与计划" && (')[1] ? tabsImplementation : '          {detailTab === "策略与计划" && ('
);
// Ah, the regex replace for tabs is fragile. Let's do a more robust string replace.
