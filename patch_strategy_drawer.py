import re

with open("src/components/merchant/ProjectCenter/StrategyCustomizationDrawer.tsx", "r") as f:
    code = f.read()

code = code.replace('"专家定制"', '"编辑"')
code = code.replace('>专家定制<', '>编辑<')

with open("src/components/merchant/ProjectCenter/StrategyCustomizationDrawer.tsx", "w") as f:
    f.write(code)

with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "r") as f:
    code = f.read()

code = code.replace('"方案中心 · 专家定制"', '"方案中心 · 编辑"')

with open("src/components/merchant/ReviewCenter/ReviewWorkbench.tsx", "w") as f:
    f.write(code)
