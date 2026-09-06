with open("src/components/merchant/CreateProjectWorkstation.tsx", "r") as f:
    code = f.read()

import re

# We need to remove conversionGoal and publishFrequency from CreateProjectWorkstation!
# First let's check if the PlanCreationSettings interface is imported and if it still has those.
# Wait, PlanCreationSettings is imported from StructuredPlanCreationFlow. We already removed them from StructuredPlanCreationFlow!

code = re.sub(r'targetKeywords: \'\',\n\s*conversionGoal: \'收藏 / 关注\',\n\s*publishFrequency: \'每天 1–2 篇\',', 'targetKeywords: [],', code)

code = re.sub(r'conversionGoal: settings\.conversionGoal,\n', '', code)
code = re.sub(r'frequency: settings\.publishFrequency,\n', 'frequency: \'每天 1-2 篇\',\n', code)

# fix targetKeywords: settings.targetKeywords
code = code.replace('targetKeywords: settings.targetKeywords,', 'targetKeywords: settings.targetKeywords.join(","),')

with open("src/components/merchant/CreateProjectWorkstation.tsx", "w") as f:
    f.write(code)
