sed -i '291,332c\
              <div className="space-y-6">\
                {/* 1. 当前需要关注 */}\
                <div className="bg-white rounded-xl py-5 px-6 border border-[#EAECF0]">\
                  <h3 className="text-[14px] font-bold text-[#111827] mb-3 flex items-center gap-2">\
                    <AlertCircle size={16} className={primaryProjectTask ? "text-red-500" : "text-emerald-500"} /> \
                    当前需要关注\
                  </h3>\
                  {primaryProjectTask ? (\
                    <div className="space-y-3">\
                      <div className="text-[14px] font-bold text-[#111827]">\
                        {primaryProjectTask.issueMessage || "任务需要处理"}\
                      </div>\
                      <div className="text-[13px] text-[#667085]">\
                        影响：{primaryProjectTask.impactScope || "当前项目进度"} · 截止：今天 18:00\
                      </div>\
                      <div>\
                        <button \
                          onClick={() => handleTaskAction(primaryProjectTask)}\
                          className="px-5 py-1.5 bg-primary-600 text-white text-[13px] font-bold rounded-xl hover:bg-primary-700 transition-colors"\
                        >\
                          {getActionTextForIssue({type: primaryProjectTask.actionType, message: primaryProjectTask.issueMessage || ""})}\
                        </button>\
                      </div>\
                      {secondaryProjectTasksCount > 0 && (\
                        <div className="pt-3 mt-1 border-t border-[#EAECF0]">\
                          <button className="text-[13px] text-[#667085] hover:text-[#111827] flex items-center gap-1">\
                            展开其他 {secondaryProjectTasksCount} 项待跟进 <ChevronDown size={14} />\
                          </button>\
                        </div>\
                      )}\
                    </div>\
                  ) : (\
                    <div className="text-[13px] text-[#667085]">\
                      项目正在按计划推进，下一个检查点为数据回收。\
                    </div>\
                  )}\
                </div>\
\
                {/* 2. 项目流水线 */}\
                <div className="bg-white rounded-xl p-5 border border-[#EAECF0]">\
                  <div className="flex items-center justify-between">\
                    <div className="space-y-1.5">\
                      <div className="text-[14px] text-[#111827] font-medium">\
                        方案已确认 · 笔记{pipeline?.totalNotes || 0}篇 · 素材就绪{pipeline?.materialReady || 0}篇 · 待发布{pipeline?.readyToPublish || 0}篇 · 观察中{pipeline?.observing || 0}篇 · 已完成{pipeline?.completed || 0}篇\
                      </div>\
                      <div className="text-[13px] text-[#667085]">\
                        下一节点：今天18:00发布首篇店长号笔记。\
                      </div>\
                    </div>\
                  </div>\
                </div>\
\
                {/* 3. 本轮方案 */}\
                <div className="bg-white rounded-xl p-6 border border-[#EAECF0]">\
                  <div className="flex items-center justify-between mb-4">\
                    <h3 className="text-[14px] font-bold text-[#111827]">本轮方案</h3>\
                    <button onClick={() => setShowProjectPlan(true)} className="text-[13px] text-primary-600 hover:text-primary-700 font-medium">查看完整方案</button>\
                  </div>\
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">\
                    <div className="flex gap-4">\
                      <div className="text-[12px] text-[#667085] w-24 shrink-0">核心问题</div>\
                      <div className="text-[13px] text-[#111827]">解决用户换粮拉肚子顾虑</div>\
                    </div>\
                    <div className="flex gap-4">\
                      <div className="text-[12px] text-[#667085] w-24 shrink-0">目标人群</div>\
                      <div className="text-[13px] text-[#111827]">新手幼犬养育者</div>\
                    </div>\
                    <div className="flex gap-4">\
                      <div className="text-[12px] text-[#667085] w-24 shrink-0">内容方法</div>\
                      <div className="text-[13px] text-[#111827]">店长专业科普 + KOC真实测评</div>\
                    </div>' src/components/merchant/ProjectCenter.tsx
