import re

with open("src/components/merchant/ExecutionCenter.tsx", "r") as f:
    code = f.read()

# 1. Remove overview from ExecutionView type and state
code = code.replace("type ExecutionView = 'overview' | 'workspace';", "")
code = code.replace("const [view, setView] = useState<ExecutionView>('overview');", "")

# 2. Remove the setView('overview') button
button_pattern = r' *<button\s*type="button"\s*onClick=\{\(\) => setView\(\'overview\'\)\}.*?<LayoutDashboard size=\{11\} />执行概览\s*</button>\s*'
code = re.sub(button_pattern, '', code, flags=re.DOTALL)

# 3. We also need to remove openDomain and references to setView('workspace')
code = code.replace("setView('workspace');", "")
code = code.replace("const openDomain = (nextDomain: DomainTab) => {\n    switchDomain(nextDomain);\n    \n  };", "")
code = code.replace("const openDomain = (nextDomain: DomainTab) => {\n    switchDomain(nextDomain);\n  };", "")

# 4. Find where overview constant is defined and remove it entirely
# It's a huge block. Let's just find the start and the `return (` after it
overview_block_pattern = r"  const overview = \([\s\S]*?  \);\s*return \(\s*<>\s*\{.*?\}\s*"
replacement = "  return (\n    <>\n      {workspace}\n      "
code = re.sub(overview_block_pattern, replacement, code, count=1)

# 5. Remove domainCards which is only used in overview
domain_cards_pattern = r"  const domainCards: Array<\{[\s\S]*?  \];\n"
code = re.sub(domain_cards_pattern, "", code)

# Let's save and test
with open("src/components/merchant/ExecutionCenter.tsx", "w") as f:
    f.write(code)

