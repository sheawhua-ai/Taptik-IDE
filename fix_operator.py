import re
with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

code = re.sub(
    r'          </div>\n        </aside>\n\n        <main className="workspace-stage min-w-0 flex-1 overflow-y-auto">',
    r'          </div>\n        </ResizableSidebar>\n\n        <main className="workspace-stage min-w-0 flex-1 overflow-y-auto">',
    code
)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)
