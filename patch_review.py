with open("src/components/merchant/ReviewCenter/ReviewTaskList.tsx", "r") as f:
    text = f.read()

text = text.replace(
    'className="workspace-sidebar-header border-b border-border-default space-y-3 shrink-0 p-3 pr-4"',
    'className="workspace-sidebar-header border-b border-border-default space-y-3 shrink-0 p-3 pr-12"'
)

with open("src/components/merchant/ReviewCenter/ReviewTaskList.tsx", "w") as f:
    f.write(text)
