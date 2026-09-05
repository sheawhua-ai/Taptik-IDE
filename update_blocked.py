import re

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "r") as f:
    code = f.read()

code = re.sub(r'const completionBlocked = missingRequiredCount > 0 \|\| pendingReturnedCount > 0;', 'const completionBlocked = false;', code)
code = re.sub(
    r'<span className=\{`ml-auto text-\[13px\] \$\{completionBlocked \? \'text-amber-700\' : \'text-text-tertiary\'\}`\}>\{missingRequiredCount > 0 \? `\$\{missingRequiredCount\} 项必拍素材未回传` : pendingReturnedCount > 0 \? `\$\{pendingReturnedCount\} 张已回传素材待判断` : \'所有回传素材均已给出结论\'\}<\/span>',
    '<span className="ml-auto text-[13px] text-text-tertiary">未验收的素材将自动放入素材中心【备选库】板块</span>',
    code
)

with open("src/components/merchant/ExecutionCenter/MaterialBatchReviewWorkbench.tsx", "w") as f:
    f.write(code)

print("Updated completionBlocked")
