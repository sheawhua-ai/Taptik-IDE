import re

with open("src/components/Workbench.tsx", "r") as f:
    code = f.read()

pattern = r'(\{\/\* === Bottom Agent Workflow Bar === \*\/\})(.*?)(?=        \{\/\* RIGHT PANEL)'

def replacer(match):
    comment = match.group(1)
    content = match.group(2)
    # wrap content in {isProcessing && ( <> content </> )}
    return comment + "\n          {isProcessing && (\n            <>\n" + content + "            </>\n          )}\n"

new_code = re.sub(pattern, replacer, code, flags=re.DOTALL)

with open("src/components/Workbench.tsx", "w") as f:
    f.write(new_code)
print("Bar updated")
