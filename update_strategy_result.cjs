const fs = require('fs');
const file = 'src/components/rings/Strategy.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const newHtml = `                <div className="space-y-6">
                  <h3 className="text-[20px] font-bold text-neutral-900 flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500" size={24} /> 本轮起盘单：幼犬换粮避坑搜索卡位
                  </h3>
                  
                  <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                    <div className="mb-6 pb-6 border-b border-neutral-100">
                      <h4 className="text-[13px] font-bold text-neutral-500 mb-2">目标：</h4>
                      <p className="text-[15px] text-neutral-800 leading-relaxed">
                        用 7 天时间铺 20 篇内容，抢占“幼犬换粮软便 / 幼犬不吃粮 / 换粮拉稀”等长尾搜索词。
                      </p>
                    </div>

                    <div className="mb-6 pb-6 border-b border-neutral-100">
                      <h4 className="text-[13px] font-bold text-neutral-500 mb-4">账号组合：</h4>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                          <h5 className="font-bold text-[14px] text-neutral-900 mb-1">官方号 <span className="text-blue-600">3 篇</span></h5>
                          <div className="text-[12px] font-medium text-neutral-500 mb-2">建立可信度</div>
                          <div className="text-[11px] text-neutral-400">专业科普打法 · 品牌素材库</div>
                        </div>
                        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                          <h5 className="font-bold text-[14px] text-neutral-900 mb-1">KOS <span className="text-indigo-600">4 篇</span></h5>
                          <div className="text-[12px] font-medium text-neutral-500 mb-2">补充服务视角</div>
                          <div className="text-[11px] text-neutral-400">顾问经验打法 · 需门店场景</div>
                        </div>
                        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                          <h5 className="font-bold text-[14px] text-neutral-900 mb-1">第三方 KOC <span className="text-emerald-600">8 篇</span></h5>
                          <div className="text-[12px] font-medium text-neutral-500 mb-2">铺真实体验</div>
                          <div className="text-[11px] text-neutral-400">素人避坑打法 · 需试用回传</div>
                        </div>
                        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
                          <h5 className="font-bold text-[14px] text-neutral-900 mb-1">客户 KOC <span className="text-amber-600">5 篇</span></h5>
                          <div className="text-[12px] font-medium text-neutral-500 mb-2">现身说法</div>
                          <div className="text-[11px] text-neutral-400">好评推荐打法 · 需客户反馈</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                      <h4 className="text-[13px] font-bold text-amber-800 mb-2 flex items-center gap-1.5"><AlertCircle size={14} /> 当前最大前置条件：</h4>
                      <ul className="text-[13px] text-amber-700 space-y-1.5 font-medium">
                        <li>• 第三方 KOC 需要先领取试用</li>
                        <li>• 客户 KOC 需要回传真实反馈</li>
                        <li>• KOS 需要确认营养顾问人设</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => window.dispatchEvent(new CustomEvent('nav-to-tab', { detail: { tab: 'matrix' } }))} className="px-6 py-3.5 bg-neutral-900 text-white rounded-xl text-[14px] font-bold hover:bg-neutral-800 transition-colors shadow-lg active:scale-95 flex items-center gap-2">生成项目流 <ArrowRight size={16} /></button>
                    <button onClick={() => setShowAdjustDrawer(true)} className="px-5 py-3.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-bold hover:bg-neutral-50 transition-colors">调整账号组合</button>
                    <button className="px-5 py-3.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-[14px] font-bold hover:bg-neutral-50 transition-colors">换一套起盘打法</button>
                  </div>
                </div>`;

const startIdx = lines.findIndex(l => l.includes('起盘任务已生成'));
if (startIdx !== -1) {
  // Replace from startIdx - 3 to startIdx + 29
  lines.splice(startIdx - 3, 33, newHtml);
  fs.writeFileSync(file, lines.join('\\n'));
  console.log('Success spliced');
}
