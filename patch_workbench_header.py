import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

# Make sure workspaceNavigation expands
old_header = """      <header className="workspace-header shrink-0 border-b border-border-default bg-surface-1">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">{workspaceNavigation ?? <button onClick={onBack} className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg hover:text-text-main" aria-label="返回执行中心"><ArrowLeft size={17} /></button>}</div>
          <div className="flex items-center gap-2">
          </div>
        </div>
      </header>"""

new_header = """      <header className="workspace-header shrink-0 border-b border-border-default bg-surface-1 px-4 py-2.5 flex items-center">
        <div className="flex-1 w-full min-w-0 flex items-center">
          {workspaceNavigation ?? <button onClick={onBack} className="rounded-lg p-1.5 text-text-tertiary hover:bg-hover-bg hover:text-text-main" aria-label="返回执行中心"><ArrowLeft size={17} /></button>}
        </div>
      </header>"""

code = code.replace(old_header, new_header)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Patched workbench header")
