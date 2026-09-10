import re
with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "r") as f:
    code = f.read()

old_header = r'''<div className="workspace-sidebar-header space-y-3 border-b border-border-default px-4 pt-4 pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-\[15px\] font-semibold text-text-main">素材任务</h2>
              <span className="text-\[13px\] text-text-tertiary mr-8">\{visibleTasks\.length\} 项</span>
            </div>
            <div className="relative mt-2">'''

new_header = '''<div className="workspace-sidebar-header border-b border-border-default p-3 pr-10">
            <div className="relative">'''

code = re.sub(old_header, new_header, code)

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "w") as f:
    f.write(code)
