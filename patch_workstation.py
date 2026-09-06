import re

with open("src/components/merchant/CreateProjectWorkstation.tsx", "r") as f:
    code = f.read()

# Fix targetKeywords
code = code.replace("targetKeywords: settings.targetKeywords,", "targetKeywords: settings.targetKeywords.join(','),")

# Remove conversionGoal and publishFrequency usages
code = re.sub(r'conversionGoal: settings\.conversionGoal,\n', '', code)
code = re.sub(r'frequency: settings\.publishFrequency,\n', 'frequency: \'每天 1–2 篇\',\n', code)

with open("src/components/merchant/CreateProjectWorkstation.tsx", "w") as f:
    f.write(code)
