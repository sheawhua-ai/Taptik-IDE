import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

# Replace the red alert badge with a neutral text or remove the red styling
# Looking at the code:
# <span className="flex items-center gap-1 font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
#   <AlertTriangle size={10} />
#   {item.operatorActionSummary}
# </span>

# The user asked: "右边的列表信息，提示红字不要" (Right list information, do not want the red text prompt)
# Note: In the image, the list is on the LEFT, but they refer to it as the "list on the right of the left nav" or just "the list".
# They specifically want to get rid of the red text/background for anomalies in the list.

old_badge = """                        <span className="flex items-center gap-1 font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          <AlertTriangle size={10} />
                          {item.operatorActionSummary}
                        </span>"""

new_badge = """                        <span className="text-text-secondary">
                          {item.operatorActionSummary}
                        </span>"""

code = code.replace(old_badge, new_badge)

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Patched left sidebar red text")
