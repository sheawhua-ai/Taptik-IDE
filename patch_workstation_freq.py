import re

with open("src/components/merchant/CreateProjectWorkstation.tsx", "r") as f:
    code = f.read()

code = code.replace("publishFrequency: '每天 1-2 篇',", "publishFrequency: '每天 1 篇',")

with open("src/components/merchant/CreateProjectWorkstation.tsx", "w") as f:
    f.write(code)
