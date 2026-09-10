import re
with open("src/components/merchant/ReviewCenter/ReviewTaskList.tsx", "r") as f:
    code = f.read()

old_header = r'''      <div className="workspace-sidebar-header border-b border-border-default space-y-3 shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-\[15px\] font-semibold text-text-main tracking-tight">复盘任务</h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick=\{onOpenCreateModal\}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-btn-main text-white text-\[13px\] font-medium hover:bg-btn-main-hover transition-colors shadow-2xs"
              title="新建复盘任务"
            >
              <Plus size=\{13\} strokeWidth=\{2.5\} />
              <span>新建复盘</span>
            </button>
            
          </div>
        </div>
        {/\* Search \*/}
        <div className="relative">'''

new_header = '''      <div className="workspace-sidebar-header border-b border-border-default space-y-3 shrink-0 p-3 pr-10">
        {/* Search */}
        <div className="relative">'''

code = re.sub(old_header, new_header, code)

old_bottom = r'''          </div>
          <div className="text-\[12px\] text-text-tertiary text-right">共 \{filteredTasks\.length\} 项</div>
        </div>'''

new_bottom = '''          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="text-[12px] text-text-tertiary">共 {filteredTasks.length} 项</div>
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-btn-main text-white text-[12px] font-medium hover:bg-btn-main-hover transition-colors"
            >
              <Plus size={12} strokeWidth={2} />
              <span>新建复盘</span>
            </button>
          </div>
        </div>'''

code = re.sub(old_bottom, new_bottom, code)

with open("src/components/merchant/ReviewCenter/ReviewTaskList.tsx", "w") as f:
    f.write(code)
