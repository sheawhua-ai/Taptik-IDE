import re

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

# Make observationDays optional or remove it from PlanCreationSettings in StructuredPlanCreationFlow
code = re.sub(r'  observationDays: number;\n', '', code)

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)
