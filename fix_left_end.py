import re
with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "r") as f:
    code = f.read()

code = re.sub(
    r'          </div>\n        </div>\n\n        \{/\* Column 2: Center Editor / Inspector Area \(Flex-1\) \*/\}',
    r'          </div>\n        </ResizableSidebar>\n\n        {/* Column 2: Center Editor / Inspector Area (Flex-1) */}',
    code
)

with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "w") as f:
    f.write(code)
