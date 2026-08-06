sed -i '492,600d' src/components/merchant/ProjectCenter.tsx
sed -i '491a\
            {activeTab === "数据" && (\
              <div className="space-y-6">\
                {currentProject.notes.every(n => n.publishStatus !== "已发布") ? (\
                  <div className="bg-white rounded-xl p-12 border border-[#EAECF0] text-center">\
                    <div className="text-[15px] font-bold text-[#111827] mb-2">项目尚未形成可复盘数据。</div>\
                    <div className="text-[13px] text-[#667085] mb-6">首篇笔记发布并识别成功后，系统将在这里开始观察。</div>\
                    <button onClick={() => setActiveTab("笔记")} className="px-4 py-2 bg-white border border-[#EAECF0] text-[#111827] font-medium text-[13px] rounded-xl hover:bg-neutral-50">\
                      查看发布进度\
                    </button>\
                  </div>\
                ) : (\
                  <div className="space-y-6">\
                    <div className="bg-white rounded-xl p-6 border border-[#EAECF0]">\
                      <div className="text-[14px] font-bold text-[#111827] mb-2">观察概况</div>\
                      <div className="text-[13px] text-[#667085]">\
                        已发布{currentProject.notes.filter(n => n.publishStatus === "已发布").length}篇 · 观察中{currentProject.notes.filter(n => n.resultStatus === "观察中").length}篇 · 已完成{currentProject.notes.filter(n => n.resultStatus === "已完成").length}篇 · {currentProject.notes.filter(n => n.resultStatus === "数据异常").length > 0 ? <span className="text-red-600 font-medium">{currentProject.notes.filter(n => n.resultStatus === "数据异常").length}篇识别异常</span> : <span>0篇识别异常</span>}\
                      </div>\
                    </div>\
                    <div className="bg-white rounded-xl p-6 border border-[#EAECF0]">\
                      <div className="mb-8">\
                        <div className="text-[14px] font-bold text-[#111827] mb-2 flex items-center gap-2">\
                          <Lightbulb size={16} className="text-primary-600" /> 本轮结论\
                        </div>\
                        <div className="text-[15px] text-[#111827] font-medium leading-relaxed mb-4">\
                          店长号专业解释型内容产生的有效咨询高于KOC体验内容。\
                        </div>\
                        <div className="space-y-3 p-4 bg-neutral-50 rounded-xl">\
                          <h4 className="text-[13px] font-bold text-[#111827]">结论依据</h4>\
                          <div className="text-[13px] text-[#667085] space-y-1">\
                            <div>· 店长号：1篇，产生31条有效咨询</div>\
                            <div>· KOC：2篇，产生14条有效咨询</div>\
                            <div>· 相较上一轮：店长号有效咨询/篇提升26%</div>\
                          </div>\
                          <div className="text-[12px] text-neutral-400 mt-2 pt-2 border-t border-[#EAECF0]">\
                            数据覆盖：3/4篇 · 统计周期：2026-08-01 至今 · 最近更新：今天 09:00\
                          </div>\
                        </div>\
                      </div>\
                      <div className="flex justify-between items-start mb-6">\
                        <h3 className="text-[14px] font-bold text-[#111827]">核心指标</h3>\
                        <button className="text-[13px] text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">\
                          查看下一轮建议 <ChevronRight size={14} />\
                        </button>\
                      </div>\
                      <div className="grid grid-cols-3 gap-6 mb-8">\
                        <div>\
                          <div className="text-[12px] text-[#667085] mb-1">已发布笔记</div>\
                          <div className="text-[24px] font-black text-[#111827]">3</div>\
                        </div>\
                        <div>\
                          <div className="text-[12px] text-[#667085] mb-1">有效咨询</div>\
                          <div className="text-[24px] font-black text-[#111827]">45</div>\
                        </div>\
                        <div>\
                          <div className="text-[12px] text-[#667085] mb-1">目标完成度</div>\
                          <div className="text-[24px] font-black text-[#111827]">90%</div>\
                        </div>\
                      </div>\
                      <div className="border-t border-[#EAECF0] pt-6">\
                        <details className="group">\
                          <summary className="flex items-center justify-between cursor-pointer list-none text-[13px] font-medium text-[#111827]">\
                            笔记数据明细\
                            <ChevronDown size={14} className="text-[#667085] group-open:rotate-180 transition-transform" />\
                          </summary>\
                          <div className="mt-4 overflow-x-auto">\
                            <table className="w-full text-left text-[12px]">\
                              <thead>\
                                <tr className="border-b border-[#EAECF0] text-[#667085]">\
                                  <th className="pb-2 font-normal">笔记标题</th>\
                                  <th className="pb-2 font-normal">发布主体</th>\
                                  <th className="pb-2 font-normal">浏览</th>\
                                  <th className="pb-2 font-normal">点赞</th>\
                                  <th className="pb-2 font-normal">收藏</th>\
                                  <th className="pb-2 font-normal">评论</th>\
                                  <th className="pb-2 font-normal">有效咨询</th>\
                                </tr>\
                              </thead>\
                              <tbody className="divide-y divide-neutral-50 text-[#111827]">\
                                <tr className="hover:bg-neutral-50 transition-colors">\
                                  <td className="py-2 pr-4 truncate max-w-[150px]">幼犬换粮总是拉肚子？店长教你避坑</td>\
                                  <td className="py-2">店长号</td>\
                                  <td className="py-2">1,204</td>\
                                  <td className="py-2">45</td>\
                                  <td className="py-2">89</td>\
                                  <td className="py-2">22</td>\
                                  <td className="py-2 font-medium">31</td>\
                                </tr>\
                                <tr className="hover:bg-neutral-50 transition-colors">\
                                  <td className="py-2 pr-4 truncate max-w-[150px]">我家金毛幼犬换粮体验，记录七天变化</td>\
                                  <td className="py-2">KOC</td>\
                                  <td className="py-2">3,451</td>\
                                  <td className="py-2">120</td>\
                                  <td className="py-2">45</td>\
                                  <td className="py-2">30</td>\
                                  <td className="py-2 font-medium">10</td>\
                                </tr>\
                                <tr className="hover:bg-neutral-50 transition-colors">\
                                  <td className="py-2 pr-4 truncate max-w-[150px]">【官方科普】幼犬肠胃敏感期如何换粮</td>\
                                  <td className="py-2">KOC</td>\
                                  <td className="py-2">892</td>\
                                  <td className="py-2">34</td>\
                                  <td className="py-2">12</td>\
                                  <td className="py-2">5</td>\
                                  <td className="py-2 font-medium">4</td>\
                                </tr>\
                              </tbody>\
                            </table>\
                          </div>\
                        </details>\
                      </div>\
                    </div>\
                  </div>\
                )}\
              </div>\
            )}\
' src/components/merchant/ProjectCenter.tsx
