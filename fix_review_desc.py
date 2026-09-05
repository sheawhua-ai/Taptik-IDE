with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "r") as f:
    code = f.read()

code = code.replace(
    '提交后，通过项立即入库；重拍要求发给执行者，任务回到待执行。',
    '通过素材将准备完成并进入待发布；需补拍项将自动回到执行任务中。'
)

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "w") as f:
    f.write(code)
