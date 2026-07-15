import re

with open('src/components/rings/ShootingAndUploadWorkbench.tsx', 'r') as f:
    content = f.read()

replacement = """          {/* ================= Progress Tab ================= */}
          {activeTab === 'progress' && (
            <div className="flex-1 overflow-y-auto p-8 bg-neutral-50 custom-scrollbar">
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[20px] font-bold text-neutral-900">素材进度大盘</h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[13px] font-bold text-neutral-700 flex items-center gap-1.5"><Filter size={14}/> 筛选</button>
                    <button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[13px] font-bold text-neutral-700 flex items-center gap-1.5"><Download size={14}/> 导出报表</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: '总素材需求', val: '320', sub: '篇笔记', color: 'text-neutral-800' },
                    { label: '已分配 / 拍摄中', val: '145', sub: '占 45%', color: 'text-blue-600' },
                    { label: '待审核 (AI/人工)', val: '86', sub: '占 27%', color: 'text-amber-600' },
                    { label: '已完成 (入库)', val: '89', sub: '占 28%', color: 'text-emerald-600' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
                      <div className="text-[13px] text-neutral-500 mb-2">{stat.label}</div>
                      <div className={`text-[28px] font-bold ${stat.color} mb-1`}>{stat.val}</div>
                      <div className="text-[12px] text-neutral-400">{stat.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-neutral-100 font-bold text-[14px] text-neutral-800 bg-neutral-50">按项目查看进度</div>
                  <div className="divide-y divide-neutral-100">
                    {[
                      { name: '双11大促 (员工拍摄)', total: 120, done: 60, wait: 20, shooting: 40 },
                      { name: '春季新品体验 (消费者)', total: 100, done: 20, wait: 60, shooting: 20 },
                      { name: '日常种草铺量', total: 100, done: 9, wait: 6, shooting: 85 }
                    ].map((item, i) => (
                      <div key={i} className="p-4 flex items-center gap-6 hover:bg-neutral-50 transition-colors">
                        <div className="w-[200px] shrink-0 font-bold text-[14px] text-neutral-800">{item.name}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden flex">
                              <div style={{width: `${(item.done/item.total)*100}%`}} className="h-full bg-emerald-500"></div>
                              <div style={{width: `${(item.wait/item.total)*100}%`}} className="h-full bg-amber-400"></div>
                              <div style={{width: `${(item.shooting/item.total)*100}%`}} className="h-full bg-blue-500"></div>
                            </div>
                            <span className="text-[12px] font-bold text-neutral-700 w-12 text-right">{Math.round((item.done/item.total)*100)}%</span>
                          </div>
                          <div className="flex gap-4 text-[11px] text-neutral-500">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 已齐 {item.done}</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> 待审 {item.wait}</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 拍摄中 {item.shooting}</span>
                          </div>
                        </div>
                        <div className="w-[100px] shrink-0 flex justify-end">
                          <button className="text-[12px] text-primary-600 font-bold hover:text-primary-700">查看详情</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= Exception Tab ================= */}
          {activeTab === 'exception' && (
            <div className="flex-1 overflow-y-auto p-8 bg-neutral-50 custom-scrollbar">
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[20px] font-bold text-neutral-900">全局异常处理</h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-[13px] font-bold text-neutral-700 flex items-center gap-1.5">未处理 (5)</button>
                    <button className="px-3 py-1.5 bg-neutral-100 text-neutral-500 rounded-lg text-[13px] font-bold flex items-center gap-1.5">已忽略</button>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { type: 'timeout', title: '员工拍摄超时', desc: '张三 (双11大促 - 门店喂食场景) 超时 2 小时未回传。', project: '双11大促' },
                    { type: 'quality', title: '消费者反复不合格', desc: '用户B (春季新品体验) 连续3次回传图片均被AI判为模糊。', project: '春季上新体验' },
                    { type: 'ai', title: 'AI 识别冲突', desc: '系统自动合并拍摄需求时发现2篇笔记的参考风格截然相反。', project: '日常种草' },
                    { type: 'timeout', title: '体验领取停滞', desc: '用户A 领取名额后超过 48 小时未填写调查问卷。', project: '春季上新体验' },
                  ].map((exc, i) => (
                    <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className={`p-2 rounded-lg shrink-0 ${exc.type === 'timeout' ? 'bg-amber-50 text-amber-600' : exc.type === 'quality' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                        <AlertOctagon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[15px] font-bold text-neutral-900">{exc.title}</h4>
                          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[11px] font-medium">{exc.project}</span>
                        </div>
                        <p className="text-[13px] text-neutral-600 mb-3">{exc.desc}</p>
                        <div className="flex items-center gap-2">
                          <button className="px-4 py-1.5 bg-neutral-900 text-white rounded-lg text-[12px] font-bold hover:bg-neutral-800 transition-colors">立即处理</button>
                          <button className="px-4 py-1.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-[12px] font-bold hover:bg-neutral-50 transition-colors">通知负责人</button>
                          <button className="px-4 py-1.5 text-neutral-400 hover:text-neutral-600 text-[12px] font-bold transition-colors">忽略</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}"""

old_block = r"""          {\/\* ================= Placeholder for Other Tabs ================= \*\/}
          {\(activeTab === 'progress' \|\| activeTab === 'exception'\) && \(
            <div className="flex-1 flex items-center justify-center text-neutral-400 bg-neutral-50">
              \[ \{tabs\.find\(t=>t\.id===activeTab\)\?\.name\} 页面内容建设中\.\.\. \]
            </div>
          \)}"""

content = re.sub(old_block, replacement, content, flags=re.DOTALL)

with open('src/components/rings/ShootingAndUploadWorkbench.tsx', 'w') as f:
    f.write(content)
