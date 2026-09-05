import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

# Remove line 474 and 475
code = re.sub(r'(\s*)\{task\.deadline && <span className="hidden md:flex.*?<\/span>\}', '', code)
code = re.sub(r'(\s*)<button onClick=\{.*?setShowContext.*?判断依据.*?<\/button>', '', code)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("OperatorTaskWorkbench updated")
