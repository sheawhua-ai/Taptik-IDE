import re

with open("src/components/merchant/ProjectCenter.tsx", "r") as f:
    code = f.read()

# Replace the specific one for "结束方案"
code = code.replace(
    'onClick={() => { setShowMoreMenu(false); updateProject(currentProject.id, { status: "已归档" }); }}\n                          className="w-full text-left px-3.5 py-2 hover:bg-surface-subtle flex items-center gap-2 text-text-main font-medium"\n                        >\n                          <CheckCircle2 size={14} className="text-text-tertiary" />\n                          <span>结束方案</span>',
    'onClick={() => { setShowMoreMenu(false); updateProject(currentProject.id, { status: "已结束" }); }}\n                          className="w-full text-left px-3.5 py-2 hover:bg-surface-subtle flex items-center gap-2 text-text-main font-medium"\n                        >\n                          <CheckCircle2 size={14} className="text-text-tertiary" />\n                          <span>结束方案</span>'
)

with open("src/components/merchant/ProjectCenter.tsx", "w") as f:
    f.write(code)
