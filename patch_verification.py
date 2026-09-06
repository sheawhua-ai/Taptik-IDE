import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "本轮验证目标" in line:
        continue
    if "继续铺量条件" in line:
        continue
    if "暂停或换打法条件" in line:
        continue
    if "发布频次" in line:
        line = re.sub(r'<div><label className="block text-\[13px\] font-semibold mb-1\.5">发布频次</label><select.*?</div></div>', '</div>', line)
    new_lines.append(line)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.writelines(new_lines)
