import re

with open("src/components/merchant/ExecutionCenter.tsx", "r") as f:
    code = f.read()

# Make sure empty state expands
old_empty = """  if (!workspaceTask) {
    workspace = (
      <div className="flex h-full min-h-0 flex-1 flex-col bg-page-bg">
        <div className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-2.5">{workspaceNavigation}</div>"""

new_empty = """  if (!workspaceTask) {
    workspace = (
      <div className="flex h-full min-h-0 flex-1 flex-col bg-page-bg">
        <div className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-2.5 flex items-center w-full">{workspaceNavigation}</div>"""

code = code.replace(old_empty, new_empty)

with open("src/components/merchant/ExecutionCenter.tsx", "w") as f:
    f.write(code)

print("Patched empty state")
