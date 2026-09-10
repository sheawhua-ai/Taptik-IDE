import re
with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "r") as f:
    code = f.read()

old_block = '''          <div className="workspace-sidebar-header border-b border-border-subtle bg-surface space-y-3 px-4 pt-4 pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-text-main">待处理笔记</h2>
              <span className="text-[13px] text-text-tertiary mr-8">{filteredNoteQueue.length} 项</span>
            </div>
            <div className="relative mt-2">'''

new_block = '''          <div className="workspace-sidebar-header border-b border-border-subtle bg-surface p-3 pr-10">
            <div className="relative">'''

code = code.replace(old_block, new_block)

with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "w") as f:
    f.write(code)
