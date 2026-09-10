import os
import glob

def replace_in_file(filepath, old, new):
    with open(filepath, 'r') as f:
        content = f.read()
    if old in content:
        content = content.replace(old, new)
        with open(filepath, 'w') as f:
            f.write(content)

replace_in_file("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", 
    'className="workspace-header shrink-0 border-b border-border-default bg-surface-1 px-4 py-2.5 flex items-center"',
    'className="workspace-header shrink-0 border-b border-border-default bg-surface-1 px-4 py-2 flex items-center"')

replace_in_file("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", 
    'className="workspace-header min-h-13 bg-surface border-b border-border-default flex items-center justify-between gap-4 shrink-0"',
    'className="workspace-header py-2 px-4 bg-surface border-b border-border-default flex items-center justify-between gap-4 shrink-0"')

replace_in_file("src/components/merchant/ExecutionCenter.tsx",
    'className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-2.5 flex items-center w-full"',
    'className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-2 flex items-center w-full"')
    
