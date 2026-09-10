import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

code = code.replace(
    'updateProject(currentProject.id, { status: "已结束" });',
    'updateProject(currentProject.id, { status: "已归档" });'
)

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(code)
