import re

with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "r") as f:
    code = f.read()

# Make sure workspaceNavigation expands in TaskDetailView too
old_header = """      {/* Top Header Bar */}
      <div className="workspace-header min-h-13 bg-surface border-b border-border-default flex items-center justify-between gap-4 shrink-0">
        {workspaceNavigation ?? (
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors flex items-center gap-1 text-[13px]"
          >
            <ArrowLeft size={16} />
            <span>返回执行中心</span>
          </button>
        )}

      </div>"""

new_header = """      {/* Top Header Bar */}
      <div className="workspace-header min-h-13 px-4 py-2.5 bg-surface border-b border-border-default flex items-center justify-between gap-4 shrink-0">
        <div className="flex-1 w-full min-w-0 flex items-center">
          {workspaceNavigation ?? (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors flex items-center gap-1 text-[13px]"
            >
              <ArrowLeft size={16} />
              <span>返回执行中心</span>
            </button>
          )}
        </div>
      </div>"""

code = code.replace(old_header, new_header)

with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "w") as f:
    f.write(code)

print("Patched detail header")
