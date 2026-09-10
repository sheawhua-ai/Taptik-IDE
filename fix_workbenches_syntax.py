import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    otw = f.read()

# Let's check OperatorTaskWorkbench.tsx
# Is it missing a closing div? The error said MaterialBatchReviewWorkbench had 4 errors.
# Let's only fix MaterialBatchReviewWorkbench.

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "r") as f:
    mbrw = f.read()

mbrw = mbrw.replace(
    'transition-colors" />\n            </div>\n            <div className="grid grid-cols-3',
    'transition-colors" />\n              </div>\n              <button onClick={() => setIsSidebarOpen(false)} title="收起侧边栏" className="w-7 h-7 shrink-0 rounded-lg hover:bg-hover-bg flex items-center justify-center text-text-secondary"><PanelLeftClose size={16} /></button>\n            </div>\n            <div className="grid grid-cols-3'
)

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "w") as f:
    f.write(mbrw)
