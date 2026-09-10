with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    text = f.read()

text = text.replace(
    'className="workspace-sidebar-header border-b border-border-default p-3 pr-10"',
    'className="workspace-sidebar-header border-b border-border-default p-3 pr-12"'
)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(text)
