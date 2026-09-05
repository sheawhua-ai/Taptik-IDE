import re

with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "r") as f:
    code = f.read()

# 1. Remove showContext, agentQuestion, agentAnswer from state
code = re.sub(r'  const \[showContext, setShowContext\] = useState\(true\);\n', '', code)
code = re.sub(r'  const \[agentQuestion, setAgentQuestion\] = useState\(\'\'\);\n', '', code)
code = re.sub(r'  const \[agentAnswer, setAgentAnswer\] = useState\(\'\'\);\n', '', code)

# 2. Remove the <aside> block entirely
# It looks like:
#         {showContext && (
#           <aside className="w-[340px] shrink-0 overflow-y-auto border-l border-border-default bg-surface-1 p-4 hidden md:block">
#           ...
#           </aside>
#         )}

aside_regex = re.compile(r'        \{showContext && \([\s\S]*?          </aside>\n        \)\}\n', re.MULTILINE)
code = aside_regex.sub('', code)


with open("src/components/merchant/ExecutionCenter/OperatorTaskWorkbench.tsx", "w") as f:
    f.write(code)

print("Removed right sidebar")
