sed -i '332,342c\
                {/* 2. 项目流水线 */}\
                <div className="bg-white rounded-xl p-5 border border-[#EAECF0]">\
                  <div className="flex items-center justify-between">\
                    <div className="space-y-1.5">\
                      <div className="text-[14px] text-[#111827] font-medium">\
                        方案已确认 · 笔记{currentProject.notes.length}篇 · 素材就绪{pipeline.materialReady}篇 · 待发布{pipeline.readyToPublish}篇 · 观察中{pipeline.observing}篇 · 已完成{pipeline.completed}篇\
                      </div>\
                      <div className="text-[13px] text-[#667085]">\
                        下一节点：今天18:00发布首篇店长号笔记。\
                      </div>\
                    </div>\
' src/components/merchant/ProjectCenter.tsx
