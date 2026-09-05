import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

# For the manual confirmation, we just keep the category as 'publish' and '发布与回传'
# The UI will re-render or shift it based on publishStage === '已回传' anyway.
code = code.replace("operatorCategory: 'progress',", "operatorCategory: 'publish',")
code = code.replace("categoryLabel: '任务跟进',", "categoryLabel: '发布与回传',")

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Patched types")
