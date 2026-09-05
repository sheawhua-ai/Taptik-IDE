import re

with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "r") as f:
    code = f.read()

func_pattern = r'  const handleSaveDraft = \(\) => \{[\s\S]*?  \};\n\n'
code = re.sub(func_pattern, '', code)

with open("src/components/merchant/ExecutionCenter/TaskDetailView.tsx", "w") as f:
    f.write(code)
