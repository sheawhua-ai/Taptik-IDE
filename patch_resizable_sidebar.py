import re
with open("src/components/merchant/ResizableSidebar.tsx", "r") as f:
    code = f.read()

# Change top-2.5 to top-3
code = code.replace(
    "absolute top-2.5 z-10 p-1.5",
    "absolute top-3 z-10 p-1.5"
)

with open("src/components/merchant/ResizableSidebar.tsx", "w") as f:
    f.write(code)
