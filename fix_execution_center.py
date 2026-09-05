import re

with open("src/components/merchant/ExecutionCenter.tsx", "r") as f:
    code = f.read()

# 1. Remove the execution overview button
button_pattern = r' *<button\s*type="button"\s*onClick=\{\(\) => setView\(\'overview\'\)\}.*?<LayoutDashboard size=\{11\} />执行概览\s*</button>\s*'
code = re.sub(button_pattern, '', code, flags=re.DOTALL)

# 2. Change state to workspace default and remove overview definition
view_state_pattern = r"const \[view, setView\] = useState<ExecutionView>\('overview'\);"
code = re.sub(view_state_pattern, "const [view, setView] = useState<ExecutionView>('workspace');", code)

# 3. Actually, we can remove the entire overview render and ExecutionView type.
# But it's safer to just change the default state and remove the button first,
# let's find `const overview = (` and remove it to clean up.
overview_pattern = r"  const overview = \(.*?  \);\s*return \(\s*<>\s*\{view === 'overview' \? overview : workspace\}\s*"
replacement = r"  return (\n    <>\n      {workspace}\n      "
# Let's check if the pattern works. 
