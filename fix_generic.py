with open("src/components/rings/ExecutionResult.tsx", "r") as f:
    content = f.read()

old_header = """                <div className="pr-20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[12px] font-bold text-neutral-700 px-2 py-0.5 bg-neutral-100 rounded border border-neutral-200">
                      {selectedTask.moduleName}
                    </span>
                    <span className="text-[12px] text-neutral-400 font-medium flex items-center gap-1">
                      <FolderOpen size={14} /> 涉及项目：{selectedTask.projectsDesc}
                    </span>
                  </div>
                  <h2 className="text-[22px] font-bold text-neutral-900">{selectedTask.importantResult}</h2>
                </div>"""

new_header = """                <div className="pr-20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[12px] font-bold text-neutral-700 px-2 py-0.5 bg-neutral-100 rounded border border-neutral-200">
                      {selectedTask.moduleName}
                    </span>
                    <span className="text-[12px] text-neutral-400 font-medium flex items-center gap-1 mr-4">
                      <FolderOpen size={14} /> 涉及项目：{selectedTask.projectsDesc}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[12px] font-bold border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors">快速确认 ({selectedTask.statusQuick})</span>
                      <span className="px-2 py-1 bg-rose-50 text-rose-700 rounded-lg text-[12px] font-bold border border-rose-200 cursor-pointer hover:bg-rose-100 transition-colors">需要处理 ({selectedTask.statusAction})</span>
                      <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-[12px] font-bold border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors">等待推进 ({selectedTask.statusWait})</span>
                    </div>
                  </div>
                  <h2 className="text-[22px] font-bold text-neutral-900">{selectedTask.importantResult}</h2>
                </div>"""

content = content.replace(old_header, new_header)

with open("src/components/rings/ExecutionResult.tsx", "w") as f:
    f.write(content)
