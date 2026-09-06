import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Make sure Database icon is shown properly
old_header = '<span className="text-[13px] font-semibold text-brand-logo">全局业务诊断 (自动同步自商家画像)</span>'
new_header = '<Database size={14} className="text-brand-logo" /><span className="text-[13px] font-semibold text-brand-logo">全局业务诊断 (自动同步自商家画像)</span>'

code = code.replace(old_header, new_header)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)
