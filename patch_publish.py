import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Fix targetKeywords field, and remove conversionGoal state usage
code = re.sub(r'  const \[publishFrequency, setPublishFrequency\] = useState.*?;\n', '', code)

# Regex to remove the publish frequency field
code = re.sub(r'<div><label className="block text-\[13px\] font-semibold mb-1\.5">发布频次</label><select value=\{publishFrequency\}[\s\S]*?</select></div>', '', code)
# Fix grid-cols-3 to grid-cols-2
code = code.replace('<div className="grid md:grid-cols-3 gap-4"><div><label className="block text-[13px] font-semibold mb-1.5">开始日期</label>', '<div className="grid md:grid-cols-2 gap-4"><div><label className="block text-[13px] font-semibold mb-1.5">开始日期</label>')

# Remove verification goals
code = re.sub(r'<div><label className="block text-\[13px\] font-semibold mb-1\.5">本轮验证目标</label><textarea rows=\{3\} value=\{draft\.coreGoalAndVerification\.primaryBusinessGoal\}[\s\S]*?</textarea></div>\s*', '', code)
code = re.sub(r'<div className="grid md:grid-cols-2 gap-4"><div><label className="block text-\[13px\] font-semibold mb-1\.5">继续铺量条件</label><textarea rows=\{3\} value=\{draft\.coreGoalAndVerification\.successCriteria\}[\s\S]*?</textarea></div></div>\s*', '', code)
code = re.sub(r'<div className="grid md:grid-cols-2 gap-4"><div><label className="block text-\[13px\] font-semibold mb-1\.5">继续铺量条件</label>[\s\S]*?暂停或换打法条件[\s\S]*?</textarea></div></div>\s*', '', code)

# Make sure they are all gone
with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)

print("Pass 2 publish changes complete")
