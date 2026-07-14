with open("src/components/rings/ContentReviewWorkbench.tsx", "r") as f:
    content = f.read()

old_filter = "n => !n.isReviewed"
new_filter = "n => !n.isReviewed && (taskStatusView === 'quick' ? true : taskStatusView === 'action' ? n.id === 'n2' : false)"

content = content.replace(old_filter, new_filter)

with open("src/components/rings/ContentReviewWorkbench.tsx", "w") as f:
    f.write(content)
