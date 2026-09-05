import re

with open("src/components/merchant/ExecutionCenter/mockData.ts", "r") as f:
    code = f.read()

# Add deadline to t-anom tasks if they don't have it
code = code.replace("assignee: { name: '体验官-元气小草莓', claimTime: '2天前 (09-02)', wechat: 'koc_strawberry_01' },",
                    "assignee: { name: '体验官-元气小草莓', claimTime: '2天前 (09-02)', wechat: 'koc_strawberry_01' },\n    deadline: '2026-09-04 10:00',")
code = code.replace("assignee: { name: '体验官-半糖去冰', claimTime: '3天前 (09-01)', wechat: 'half_sugar_02' },",
                    "assignee: { name: '体验官-半糖去冰', claimTime: '3天前 (09-01)', wechat: 'half_sugar_02' },\n    deadline: '2026-09-03 09:30',")


with open("src/components/merchant/ExecutionCenter/mockData.ts", "w") as f:
    f.write(code)

print("Patched deadline")
