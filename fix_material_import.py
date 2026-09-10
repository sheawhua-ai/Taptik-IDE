import re
with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "r") as f:
    code = f.read()

code = code.replace(
    "import type { ExecutionTask, MaterialSubItem, UploadedAsset } from './types';",
    "import type { ExecutionTask, MaterialSubItem, UploadedAsset } from './types';\nimport { ResizableSidebar } from './ResizableSidebar';"
)

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "w") as f:
    f.write(code)
