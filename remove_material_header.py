import re

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "r") as f:
    code = f.read()

# I want to remove this block:
#           <div className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-3">
# ...
#             ) : null}
#           </div>
# which comes right before `{activeQueue === '待审核' ? <div className="shrink-0 border-b ...`

pattern = r'(\s*)<div className="shrink-0 border-b border-border-default bg-surface-1 px-4 py-3">.*?\) : null\}\s*<\/div>'

code = re.sub(pattern, '', code, flags=re.DOTALL)

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "w") as f:
    f.write(code)

print("Header removed")
