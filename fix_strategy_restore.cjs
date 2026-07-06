const fs = require('fs');
const file = 'src/components/rings/Strategy.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `                      {(flowState === "generating" || flowState === "running") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-rose-200 p-8 shadow-xl mt-8"
            >`;

const newStr = `                      {(flowState === "generating" || flowState === "running") && (
                        <div className="px-6 py-3.5 bg-rose-50 text-rose-700 rounded-xl text-[14px] font-bold flex items-center gap-2 border border-rose-100">
                          <CheckCircle2 size={16} /> 已采用
                        </div>
                      )}
                      
                      <button
                        onClick={() => setShowAdjustDrawer(true)}
                        className="px-6 py-3.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-bold hover:bg-neutral-50 transition-colors flex items-center gap-2 shadow-sm"
                        disabled={flowState !== "suggestion"}
                      >
                        <Settings2 size={16} /> 调整方案
                      </button>
                      <div className="flex-1" />
                      <button
                        onClick={() => setShowEvidenceDrawer(true)}
                        className="px-4 py-3.5 text-rose-600 text-[13px] font-bold hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        为什么推荐这个方向？ <ChevronRight size={16} />
                      </button>
                    </div>
                 </div>
              </motion.div>

              {/* 备选方案 */}
              <div className="flex flex-col gap-4">
                <div className={\`bg-white rounded-3xl border p-6 shadow-sm transition-colors group \${flowState === "suggestion" ? "border-neutral-200 hover:border-rose-200 cursor-pointer" : "border-neutral-200 opacity-50 cursor-not-allowed"}\`} onClick={() => { if(flowState === "suggestion") { setSelectedDirection("真实喂养场景种草"); setSelectedDesc("适合素材充足时做。主要依赖用户真实投稿的喂养视频，二次剪辑。"); } }}>
                  <div className="text-[12px] font-bold text-neutral-400 mb-3 uppercase tracking-wider">备选 A</div>
                  <h4 className="text-[18px] font-bold text-neutral-900 mb-2">真实喂养场景种草</h4>
                  <p className="text-[13px] text-neutral-500 mb-6">适合素材充足时做</p>
                  {flowState === "suggestion" && <div className="text-[13px] font-bold text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">选择此方向 <ArrowRight size={16} /></div>}
                </div>
                <div className={\`bg-white rounded-3xl border p-6 shadow-sm transition-colors group \${flowState === "suggestion" ? "border-neutral-200 hover:border-rose-200 cursor-pointer" : "border-neutral-200 opacity-50 cursor-not-allowed"}\`} onClick={() => { if(flowState === "suggestion") { setSelectedDirection("高意向私域承接"); setSelectedDesc("适合已有评论和私信积累时做。重点将已有高意向公域用户导流至企微。"); } }}>
                  <div className="text-[12px] font-bold text-neutral-400 mb-3 uppercase tracking-wider">备选 B</div>
                  <h4 className="text-[18px] font-bold text-neutral-900 mb-2">高意向私域承接</h4>
                  <p className="text-[13px] text-neutral-500 mb-6">适合已有评论和私信积累时做</p>
                  {flowState === "suggestion" && <div className="text-[13px] font-bold text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">选择此方向 <ArrowRight size={16} /></div>}
                </div>
                {flowState === "suggestion" && (
                  <button onClick={() => window.dispatchEvent(new CustomEvent('open-expert-app', { detail: { expert: '操盘副手', context: '除了现有的方案，还有其他适合的备选方向吗？' }}))} className="mt-2 text-[13px] font-bold text-neutral-500 hover:text-neutral-800 flex items-center justify-center gap-2 bg-white border border-neutral-200 py-4 rounded-3xl border-dashed hover:border-neutral-300 transition-colors">
                     <Plus size={18} /> 换一组方案
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 4. 生成中 / 生成完成 (显示在底部) */}
          {(flowState === "generating" || flowState === "running") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-rose-200 p-8 shadow-xl mt-8"
            >`;

content = content.replace(targetStr, newStr);
fs.writeFileSync(file, content);
console.log("Success restored block");
