import re

with open("src/components/merchant/EmployeeManagement.tsx", "r") as f:
    code = f.read()

# Add trigger prop
code = code.replace(
    'export function EmployeeManagement() {',
    'export function EmployeeManagement({ addTrigger = 0 }: { addTrigger?: number }) {'
)

# Use useEffect to watch addTrigger
code = code.replace(
    'const [editTags, setEditTags] = useState("");',
    'const [editTags, setEditTags] = useState("");\n\n  React.useEffect(() => {\n    if (addTrigger > 0) {\n      handleAddEmployee();\n    }\n  }, [addTrigger]);'
)

# Remove the original add button
code = re.sub(
    r'<button\s*onClick=\{handleAddEmployee\}\s*className="flex items-center gap-1\.5 rounded-lg bg-action-primary px-3\.5 py-2 text-\[13px\] font-semibold text-white hover:bg-action-primary-hover"\s*>\s*<Plus size=\{15\} />\s*添加员工\s*</button>',
    r'',
    code
)

with open("src/components/merchant/EmployeeManagement.tsx", "w") as f:
    f.write(code)
