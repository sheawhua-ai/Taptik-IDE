import fs from 'fs';

let content = fs.readFileSync('src/components/merchant/ProjectCenter.tsx', 'utf-8');

const targetStr = `          {detailTab === "策略与计划" && (
            <div className="max-w-4xl mx-auto p-8 text-center text-neutral-400">
               策略与计划详细内容
            </div>
          )}
          {detailTab === "内容与素材" && (
            <div className="max-w-4xl mx-auto p-8 text-center text-neutral-400">
               按执行批次展示内容草稿与素材缺口
            </div>
          )}
          {detailTab === "发布与互动" && (
            <div className="max-w-4xl mx-auto p-8 text-center text-neutral-400">
               展示项目内发布任务和笔记结果
            </div>
          )}
          {detailTab === "变更记录" && (
            <div className="max-w-4xl mx-auto p-8 text-center text-neutral-400">
               按时间轴展示操作记录
            </div>
          )}`;

const replacementStr = `          {detailTab === "策略与计划" && (
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

if (content.includes("策略与计划详细内容")) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync('src/components/merchant/ProjectCenter.tsx', content);
  console.log("Tabs updated successfully.");
} else {
  console.log("Target string not found.");
}
