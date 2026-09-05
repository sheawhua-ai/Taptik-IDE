import re

with open("src/components/Workbench.tsx", "r") as f:
    code = f.read()

# Replace the conditional icon with just ArrowUp
old_icon_logic = "query ? <ArrowUp size={18} /> : <AudioLines size={16} />"
new_icon_logic = "<ArrowUp size={18} />"

code = code.replace(old_icon_logic, new_icon_logic)

with open("src/components/Workbench.tsx", "w") as f:
    f.write(code)

print("Updated send button")
