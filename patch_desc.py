with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "r") as f:
    code = f.read()

code = code.replace("确认发布周期、承接动作和复盘条件。", "确认发布周期和观察时间。")

with open("src/components/merchant/CreateProject/StructuredPlanCreationFlow.tsx", "w") as f:
    f.write(code)
