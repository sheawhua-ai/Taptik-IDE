import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

code = code.replace(
    'onClick={() => { setShowMoreMenu(false); /* Add restart logic here */ }}',
    'onClick={() => { setShowMoreMenu(false); updateProject(currentProject.id, { status: "进行中" }); }}'
)

code = code.replace(
    'onClick={() => { setShowMoreMenu(false); /* Add end project logic */ }}',
    'onClick={() => { setShowMoreMenu(false); updateProject(currentProject.id, { status: "已结束" }); }}'
)

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(code)
