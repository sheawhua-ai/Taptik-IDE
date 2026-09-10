import re

with open("src/components/settings/MerchantManagement.tsx", "r") as f:
    code = f.read()

# Replace the arrow button logic
code = re.sub(
    r'\{!isArchived && !isActive \? <button type="button" onClick=\{[^\}]+\} title="进入商家空间" className="flex h-8 w-8 items-center justify-center rounded-lg bg-btn-main text-white hover:bg-btn-main-hover"><ArrowRight size=\{14\} /></button> : null\}',
    r'',
    code
)

with open("src/components/settings/MerchantManagement.tsx", "w") as f:
    f.write(code)
