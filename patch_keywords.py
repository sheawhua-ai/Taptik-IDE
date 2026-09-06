import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Remove the old TargetKeywords input block
code = re.sub(r'<div><label className="block text-\[13px\] font-semibold mb-1\.5">目标关键词[\s\S]*?</label><input value=\{targetKeywords\} onChange=\{\(event\) => setTargetKeywords\(event\.target\.value\)\} placeholder="用逗号分隔关键词" className="w-full rounded-xl border border-border-default px-3\.5 py-2\.5 text-\[13px\] outline-none focus:border-neutral-500" /></div>', '', code)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)
