import re

with open("src/components/merchant/CreateProjectWorkstation.tsx", "r") as f:
    code = f.read()

# Update PlanCreationSettings interface
code = re.sub(r'  observationDays: number;\n', '', code)
# Update handleConfirmAndCreateProject defaults
code = re.sub(r'      observationDays: 14,\n', '', code)

with open("src/components/merchant/CreateProjectWorkstation.tsx", "w") as f:
    f.write(code)
