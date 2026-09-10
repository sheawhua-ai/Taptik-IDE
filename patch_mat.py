import re
with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "r") as f:
    code = f.read()

code = code.replace(
    'className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-2.5"',
    'className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-2"'
)

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "w") as f:
    f.write(code)
