import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Fix targetKeywords string array
code = code.replace("targetKeywords: string;", "targetKeywords: string[];")

# Remove conversionGoal and publishFrequency from PlanCreationSettings interface
code = re.sub(r'  conversionGoal: string;\n', '', code)
code = re.sub(r'  publishFrequency: string;\n', '', code)

# Remove them from onConfirm call
code = re.sub(r'      conversionGoal,\n', '', code)
code = re.sub(r'      publishFrequency,\n', '', code)

# Remove any remaining useState variables that were deleted but maybe missed
code = re.sub(r'  const \[conversionGoal, setConversionGoal\] = useState.*?;\n', '', code)
code = re.sub(r'  const \[publishFrequency, setPublishFrequency\] = useState.*?;\n', '', code)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)
