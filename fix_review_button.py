import re

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "r") as f:
    code = f.read()

# Line 563: <button ...>提交审核结果</button>
code = code.replace('<Send size={12} />提交审核结果', '<Send size={12} />完成审核并流转')

# Line 601: <h3 ...>提交审核结果</h3>
code = code.replace('>提交审核结果</h3>', '>确认完成本次审核？</h3>')

# Line 609: <button ...>提交审核结果</button>
code = code.replace('className="rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-semibold text-white">提交审核结果</button>',
                    'className="rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-semibold text-white">确认流转</button>')

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "w") as f:
    f.write(code)
