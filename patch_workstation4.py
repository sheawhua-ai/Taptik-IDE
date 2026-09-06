import re

with open("src/components/merchant/CreateProjectWorkstation.tsx", "r") as f:
    code = f.read()

# Make observationDays fallback
code = re.sub(r'observationDays: settings\.observationDays,', 'observationDays: 14,', code)

with open("src/components/merchant/CreateProjectWorkstation.tsx", "w") as f:
    f.write(code)
