import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

code = code.replace("if (primaryGoal === '搜索卡位' && !targetKeywords.trim()) {", "if (primaryGoal === '搜索卡位' && targetKeywords.length === 0) {")
code = code.replace("targetKeywords: string;", "targetKeywords: string[];")
code = code.replace("targetKeywords: targetKeywords.join(','),", "targetKeywords,") # If targetKeywords was converted

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)
