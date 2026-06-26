import fs from 'fs';

let content = fs.readFileSync('src/components/rings/ExecutionResult.tsx', 'utf-8');

// Replace activeDrawer type
content = content.replace(
  /const \[activeDrawer, setActiveDrawer\] = useState<"material" \| "external" \| "internal" \| null>\(null\);/,
  `const [activeDrawer, setActiveDrawer] = useState<"review" | "material" | "external" | "internal" | null>(null);`
);

// Add Sparkles icon to imports
content = content.replace(
  /import \{ CheckCircle2, Check, ArrowRight, X, Image as ImageIcon, Link as LinkIcon, Users, QrCode \} from "lucide-react";/,
  `import { CheckCircle2, Check, ArrowRight, X, Image as ImageIcon, Link as LinkIcon, Users, QrCode, Sparkles } from "lucide-react";`
);

// Update '可直接审核' button onClick
content = content.replace(
  /<button onClick=\{.*?tab: "content".*?\} className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-\[13px\] font-medium transition-colors">\s*开始审核\s*<\/button>/,
  `<button onClick={() => setActiveDrawer("review")} className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[13px] font-medium transition-colors">
            开始审核
          </button>`
);

// Create the new drawers replacement block
const newDrawers = `
      {/* Drawers */}
      <AnimatePresence>
        {activeDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/20 z-50 flex justify-end"
            onClick={() => setActiveDrawer(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {activeDrawer === "review" && (
                <>
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-emerald-50/50">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[16px]">内容审核队列</h3>
                      <p className="text-[12px] text-neutral-500 mt-1">3 个内容包待快速检查</p>
                    </div>
                    <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><X size={18} className="text-neutral-500" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/50">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      <div className="flex-shrink-0 px-3 py-1.5 bg-neutral-900 text-white text-[12px] rounded-lg">#1 幼犬挑食</div>
                      <div className="flex-shrink-0 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-500 text-[12px] rounded-lg">#2 肠胃敏感</div>
                      <div className="flex-shrink-0 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-500 text-[12px] rounded-lg">#3 换粮误区</div>
                    </div>
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm relative group">
                       <h4 className="font-bold text-[14px] text-neutral-900 mb-2">#1 幼犬挑食其实是你的锅</h4>
                       <div className="bg-neutral-50 p-3 rounded border border-neutral-100 text-[12px] text-neutral-700 leading-relaxed mb-4">
                         "很多新手铲屎官遇到狗子不吃饭，第一反应就是饿它一顿！其实幼犬挑食很可能是换粮方式不对..."
                       </div>
                       
                       <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 mb-4 relative">
                         <div className="flex items-center gap-2 mb-2">
                           <Sparkles size={14} className="text-indigo-500" />
                           <span className="text-[12px] font-bold text-indigo-900">AI 正在协同修改</span>
                         </div>
                         <p className="text-[12px] text-indigo-700/80 mb-2">
                           当前口吻偏官方，建议调整为更情绪化的“吐槽向”开头。
                         </p>
                         <div className="flex gap-2">
                           <button className="flex-1 py-1.5 bg-indigo-500 text-white text-[11px] font-medium rounded hover:bg-indigo-600">采用修改</button>
                           <button className="flex-1 py-1.5 bg-white border border-indigo-200 text-indigo-600 text-[11px] font-medium rounded hover:bg-indigo-50">再改一次</button>
                         </div>
                       </div>

                       <div className="flex gap-2 pt-2 border-t border-neutral-100">
                         <button className="flex-1 py-2 bg-emerald-500 text-white text-[12px] font-medium rounded-lg hover:bg-emerald-600">审核通过，下一篇</button>
                         <button className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">退回/批注</button>
                       </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-neutral-100 bg-white">
                     <button onClick={() => { setActiveDrawer(null); window.dispatchEvent(new CustomEvent("nav-to-tab", { detail: { tab: "content" } })); }} className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 rounded-xl text-[13px] font-medium transition-colors flex items-center justify-center gap-2">
                       进入账号与发布模块做深度处理 <ArrowRight size={14} />
                     </button>
                  </div>
                </>
              )}

              {activeDrawer === "material" && (
                <>
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-amber-50/50">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[16px]">素材库装填匹配</h3>
                      <p className="text-[12px] text-neutral-500 mt-1">4 个内容包需要匹配封面图与场景图</p>
                    </div>
                    <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><X size={18} className="text-neutral-500" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50">
                    {/* Item 1 */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                       <h4 className="font-bold text-[14px] text-neutral-900 mb-1">幼犬软便必看指南</h4>
                       <div className="flex gap-2 mb-3">
                         <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">缺封面图</span>
                         <span className="text-[11px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">缺幼犬喂食片段</span>
                       </div>
                       <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100 mb-3">
                         <div className="flex items-center gap-2 mb-2 text-[12px] font-medium text-neutral-700">
                           <ImageIcon size={14} className="text-primary-500" /> AI 推荐素材
                         </div>
                         <div className="flex gap-2 overflow-x-auto pb-1">
                           <div className="w-20 h-20 bg-neutral-200 rounded object-cover flex-shrink-0 flex items-center justify-center text-[10px] text-neutral-400">封面_01.jpg</div>
                           <div className="w-20 h-20 bg-neutral-200 rounded object-cover flex-shrink-0 flex items-center justify-center text-[10px] text-neutral-400">场景_03.mp4</div>
                         </div>
                         <div className="mt-2 text-[11px] text-neutral-500 flex items-center justify-between">
                           <span>重复度风险：极低</span>
                           <span className="text-emerald-600">适宜做封面</span>
                         </div>
                       </div>
                       <div className="flex gap-2">
                         <button className="flex-1 py-2 bg-neutral-900 text-white text-[12px] font-medium rounded-lg hover:bg-neutral-800">采用匹配，下一篇</button>
                         <button className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">换一组</button>
                       </div>
                       <button className="w-full mt-2 py-1.5 text-[12px] text-neutral-500 hover:text-neutral-800">标记缺素材转拍摄任务</button>
                    </div>
                  </div>
                  <div className="p-4 border-t border-neutral-100 bg-white">
                     <button onClick={() => { setActiveDrawer(null); window.dispatchEvent(new CustomEvent("nav-to-tab", { detail: { tab: "matrix" } })); }} className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 rounded-xl text-[13px] font-medium transition-colors flex items-center justify-center gap-2">
                       进入项目与内容模块做深度处理 <ArrowRight size={14} />
                     </button>
                  </div>
                </>
              )}

              {activeDrawer === "external" && (
                <>
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-indigo-50/50">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[16px]">外部领取入口</h3>
                      <p className="text-[12px] text-neutral-500 mt-1">3 个任务适合外部账号分发</p>
                    </div>
                    <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><X size={18} className="text-neutral-500" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/50">
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center text-indigo-600"><QrCode size={14} /></div>
                        <h4 className="font-bold text-[14px] text-neutral-900">扫码即发布包</h4>
                      </div>
                      <p className="text-[12px] text-neutral-500 mb-3">素材已装填，用户扫码后可快速复制发布</p>
                      <button className="w-full py-2 bg-neutral-900 text-white text-[12px] font-medium rounded-lg hover:bg-neutral-800">生成任务组码，下一篇</button>
                    </div>
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-emerald-600"><ImageIcon size={14} /></div>
                        <h4 className="font-bold text-[14px] text-neutral-900">真实体验领取</h4>
                      </div>
                      <p className="text-[12px] text-neutral-500 mb-3">领取者需上传自己拍摄的图片/视频作为素材</p>
                      <button className="w-full py-2 bg-neutral-900 text-white text-[12px] font-medium rounded-lg hover:bg-neutral-800">生成体验任务码</button>
                    </div>
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600"><LinkIcon size={14} /></div>
                        <h4 className="font-bold text-[14px] text-neutral-900">单篇发布链接</h4>
                      </div>
                      <p className="text-[12px] text-neutral-500 mb-3">指定某个外部账号发布单篇内容</p>
                      <button className="w-full py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">复制单篇链接</button>
                    </div>
                  </div>
                  <div className="p-4 border-t border-neutral-100 bg-white">
                     <button onClick={() => { setActiveDrawer(null); window.dispatchEvent(new CustomEvent("nav-to-tab", { detail: { tab: "interaction" } })); }} className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 rounded-xl text-[13px] font-medium transition-colors flex items-center justify-center gap-2">
                       进入协同任务模块做深度处理 <ArrowRight size={14} />
                     </button>
                  </div>
                </>
              )}

              {activeDrawer === "internal" && (
                <>
                  <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-blue-50/50">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-[16px]">内部任务派发</h3>
                      <p className="text-[12px] text-neutral-500 mt-1">2 个协同任务待内部员工处理</p>
                    </div>
                    <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><X size={18} className="text-neutral-500" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/50">
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-[14px] text-neutral-900">幼犬到家实拍补充</h4>
                        <span className="text-[11px] text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">高优</span>
                      </div>
                      <div className="space-y-1.5 mb-4 text-[12px]">
                        <div className="flex justify-between"><span className="text-neutral-500">负责人</span><span className="font-medium text-neutral-900 flex items-center gap-1"><Users size={12} /> 李店长</span></div>
                        <div className="flex justify-between"><span className="text-neutral-500">通知渠道</span><span className="text-neutral-700">企微 / 飞书</span></div>
                        <div className="flex justify-between"><span className="text-neutral-500">截止时间</span><span className="text-neutral-700">今日 18:00</span></div>
                      </div>
                      <div className="bg-neutral-50 p-2.5 rounded text-[11px] text-neutral-600 mb-4 border border-neutral-100">
                        <strong>AI 任务说明：</strong> 需要 3 段狗狗吃粮的真实短视频，背景要明亮，尽量体现狗子开心。
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-blue-600 text-white text-[12px] font-medium rounded-lg hover:bg-blue-700">发送通知，下一条</button>
                        <button className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 text-[12px] font-medium rounded-lg hover:bg-neutral-50">改派</button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-neutral-100 bg-white">
                     <button onClick={() => { setActiveDrawer(null); window.dispatchEvent(new CustomEvent("nav-to-tab", { detail: { tab: "interaction" } })); }} className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 rounded-xl text-[13px] font-medium transition-colors flex items-center justify-center gap-2">
                       进入协同任务模块做深度处理 <ArrowRight size={14} />
                     </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
\`;

content = content.replace(
  /\{\/\* Drawers \*\/\}[\s\S]*?<\/AnimatePresence>/,
  newDrawers
);

// We need to also update the `查看全部内容包` button to be `进入完整模块深度处理` or just remain as is, since the instruction says "只有复杂场景才进入具体模块做深度处理". Wait, the bottom link says: 
// <button onClick={() => window.dispatchEvent(new CustomEvent("nav-to-tab", { detail: { tab: "content" } }))} className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-4">
// 查看全部内容包
// </button>
// This is fine.

fs.writeFileSync('src/components/rings/ExecutionResult.tsx', content);
