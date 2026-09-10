import re

with open("src/components/merchant/AccountAssetsV2.tsx", "r") as f:
    code = f.read()

code = code.replace(
    'const [viewMode, setViewMode] = useState<ViewMode>("accounts");',
    'const [viewMode, setViewMode] = useState<ViewMode>("accounts");\n  const [addEmployeeTrigger, setAddEmployeeTrigger] = useState(0);'
)

with open("src/components/merchant/AccountAssetsV2.tsx", "w") as f:
    f.write(code)
