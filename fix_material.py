import re
with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "r") as f:
    code = f.read()

code = re.sub(
    r'          </div>\n        </aside>\n\n        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">',
    r'          </div>\n        </ResizableSidebar>\n\n        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">',
    code
)

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "w") as f:
    f.write(code)
