import re

with open("src/components/DataCenter.tsx", "r") as f:
    content = f.read()

new_ui = """        {dataSubNav === 'roi_attribution' && (
          <div className="p-8 space-y-8 animate-in fade-in duration-500 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 tracking-tight flex items-center gap-2">复盘归因</h3>
                <p className="text-[13px] text-neutral-400 mt-1">智能分析数据，发现执行结与策略偏差</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {[
                  {
                    conclusion: '素人口吻比官方口吻转化率高 30%',
                    basis: '2 篇素人笔记带来 15 条私信，3 篇官方笔记仅 2 条',
                    scope: '当前项目 5 篇相关笔记',
                    confidence: '高 (92%)',
                    impact: '建议后续该品类取消官方口吻发布，全量采用素人体验测评口吻。'
                  },
                  {
                    conclusion: '“真实喂食”场景图比“棚拍白底图”点击率高 40%',
                    basis: 'A/B 测试显示，场景图 CTR 8.5%，白底图 CTR 4.1%',
                    scope: '最近 12 篇带图笔记',
                    confidence: '极高 (98%)',
                    impact: '影响素材产出标准：后续所有视觉均需带入真实生活场景。'
                  },
                  {
                    conclusion: '周末晚 8-10 点发布互动量翻倍',
                    basis: '历史数据：周末晚间平均互动 120，其他时段平均 45',
                    scope: '过去 30 天全部 45 篇笔记',
                    confidence: '中 (75%)',
                    impact: '可优化发布排期池，将核心转化笔记集中在周末晚间。'
                  }
                ].map((card, i) => (
                  <div key={i} className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm break-inside-avoid">
                    <div className="flex items-start gap-3 mb-4">
                      <Sparkles size={18} className="text-primary-500 shrink-0 mt-0.5" />
                      <h4 className="text-[15px] font-bold text-neutral-900">{card.conclusion}</h4>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="text-[12px]">
                        <span className="text-neutral-500 block mb-1">数据依据</span>
                        <span className="font-medium text-neutral-900">{card.basis}</span>
                      </div>
                      <div className="text-[12px]">
                        <span className="text-neutral-500 block mb-1">样本覆盖范围</span>
                        <span className="font-medium text-neutral-900">{card.scope}</span>
                      </div>
                      <div className="text-[12px]">
                        <span className="text-neutral-500 block mb-1">AI 置信度</span>
                        <span className="font-bold text-primary-600">{card.confidence}</span>
                      </div>
                      <div className="text-[12px] bg-primary-50 p-3 rounded-xl border border-primary-100/50">
                        <span className="text-primary-800 font-bold block mb-1">对当前打法影响</span>
                        <span className="text-primary-700 leading-relaxed">{card.impact}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setActionConfirmPopup({title: card.conclusion, action: '立即处理'})} className="w-full py-2 bg-neutral-900 text-white rounded-xl text-[12px] font-bold hover:bg-neutral-800 transition-colors">立即处理</button>
                      <button onClick={() => setActionConfirmPopup({title: card.conclusion, action: '下轮验证'})} className="w-full py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[12px] font-bold hover:bg-neutral-50 transition-colors">下轮验证</button>
                      <button className="w-full py-2 text-neutral-500 hover:bg-neutral-50 rounded-xl text-[12px] font-bold transition-colors">保留观察</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {actionConfirmPopup && (
                <div className="fixed inset-0 z-[200] bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl shadow-2xl p-6 w-[400px]"
                  >
                    <h3 className="text-[16px] font-bold text-neutral-900 mb-2">{actionConfirmPopup.action}已确认</h3>
                    <p className="text-[13px] text-neutral-500 mb-6">对于「{actionConfirmPopup.title}」的结论，您希望如何沉淀该经验？</p>
                    <div className="space-y-2">
                      <button onClick={() => setActionConfirmPopup(null)} className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-primary-50 hover:text-primary-700 border border-neutral-200 hover:border-primary-200 rounded-xl text-[13px] font-bold transition-colors">更新商家记忆</button>
                      <button onClick={() => setActionConfirmPopup(null)} className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-primary-50 hover:text-primary-700 border border-neutral-200 hover:border-primary-200 rounded-xl text-[13px] font-bold transition-colors">提炼为我的运营方法</button>
                      <button onClick={() => setActionConfirmPopup(null)} className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-primary-50 hover:text-primary-700 border border-neutral-200 hover:border-primary-200 rounded-xl text-[13px] font-bold transition-colors">加入下轮项目建议</button>
                    </div>
                    <button onClick={() => setActionConfirmPopup(null)} className="mt-4 w-full py-2 text-[12px] text-neutral-400 hover:text-neutral-600">暂不处理</button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}"""

start_idx = content.find("{dataSubNav === 'roi_attribution' && (")
end_idx = content.find("{dataSubNav === 'scheduled' && (", start_idx)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_ui + "\n        " + content[end_idx:]
    with open("src/components/DataCenter.tsx", "w") as f:
        f.write(content)
    print("Replaced!")
else:
    print("Not found")

